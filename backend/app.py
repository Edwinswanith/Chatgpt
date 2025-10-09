from flask import Flask, request, jsonify, stream_with_context, Response, session, g, current_app
from flask_cors import CORS
import os
from dotenv import load_dotenv
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from uuid import uuid4 # Import uuid4
import json # Import json for handling JSON data
import io # Import io for handling byte streams
import base64 # Import base64 for decoding image data
from PyPDF2 import PdfReader # Import PdfReader for PDF processing
from utility.create_db import create_database
from utility.google_genai import generate_text_from_genai, configure_genai, generate_chat_content_stream, generate_mini_chat_content_stream, prepare_chat_input_parts
from werkzeug.security import generate_password_hash, check_password_hash # Import security utilities

load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv('SECRET_KEY') or os.environ.get('SECRET_KEY', 'supersecretkey') # Secret key for session management
app.config['SESSION_COOKIE_SAMESITE'] = 'None'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
CORS(app, resources={r"/*":{
    "origins": ["http://localhost:5173", "https://6h82fbwn-5173.inc1.devtunnels.ms", "https://6h82fbwn-5000.inc1.devtunnels.ms"],
    "methods": ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    "allow_headers": ["Content-Type", "Authorization"],
    "supports_credentials": True
}})

# Configure Database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///chat.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

DB_Message, DB_User, DB_HighlightedPhrase = create_database(db) # create_database now returns Message, User, and HighlightedPhrase models

# Configure Generative AI
configure_genai()

@app.before_request
def create_tables():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    if DB_User.query.filter_by(username=username).first():
        return jsonify({'error': 'Username already exists'}), 409

    hashed_password = generate_password_hash(password)
    new_user = DB_User(username=username, password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User registered successfully'}), 201

@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username')
    password = request.json.get('password')

    if not username or not password:
        return jsonify({'error': 'Username and password are required'}), 400

    user = DB_User.query.filter_by(username=username).first()

    if user and check_password_hash(user.password, password):
        session['user_id'] = user.id
        g.user = user
        return jsonify({'message': 'Login successful', 'username': user.username}), 200
    else:
        return jsonify({'error': 'Invalid credentials'}), 401

@app.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)
    g.user = None
    return jsonify({'message': 'Logged out successfully'}), 200

@app.before_request
def load_logged_in_user():
    user_id = session.get('user_id')
    if user_id is None:
        g.user = None
    else:
        g.user = DB_User.query.get(user_id)

def login_required(view):
    import functools
    @functools.wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return jsonify({'error': 'Unauthorized, please log in.'}), 401
        return view(**kwargs)
    return wrapped_view


@app.route('/')
def index():
    return "<h1>Welcome to the Chat Application Backend</h1>"

@app.route('/sessions', methods=['GET'])
@login_required
def get_sessions():
    sessions = db.session.query(DB_Message.session_id, db.func.max(DB_Message.timestamp)).filter(DB_Message.context_type == 'general_chat', DB_Message.user_id == g.user.id).group_by(DB_Message.session_id).order_by(db.func.max(DB_Message.timestamp).desc()).all()
    return jsonify([session[0] for session in sessions])

@app.route('/history', methods=['GET'])
@login_required
def get_history():
    session_id = request.args.get('sessionId')

    if not session_id:
        return jsonify({'error': 'Session ID not provided'}), 400

    messages = DB_Message.query.filter_by(session_id=session_id, context_type='general_chat', user_id=g.user.id).order_by(DB_Message.timestamp).all()
    highlights = DB_HighlightedPhrase.query.filter_by(session_id=session_id, user_id=g.user.id).all()

    return jsonify({
        'messages': [msg.to_dict() for msg in messages],
        'highlights': [h.to_dict() for h in highlights]
    })

@app.route('/history/<session_id>', methods=['DELETE'])
@login_required
def delete_history(session_id):
    try:
        messages_to_delete = DB_Message.query.filter_by(session_id=session_id, context_type='general_chat', user_id=g.user.id).all()
        for message in messages_to_delete:
            db.session.delete(message)
        db.session.commit()
        return jsonify({'message': f'Session {session_id} and its history deleted successfully'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/chat', methods=['POST'])
@login_required
def chat():
    try:
        user_message_text = request.json.get('message')
        session_id = request.json.get('sessionId')
        images_data = request.json.get('images', [])

        current_app.logger.debug(f"Received chat request: message='{user_message_text}', sessionId='{session_id}', images_data_length={len(images_data)}")

        if not user_message_text and not images_data:
            current_app.logger.warning("Bad request: No message or images provided.")
            return jsonify({'error': 'No message or images provided'}), 400
        if not session_id:
            current_app.logger.warning("Bad request: Session ID not provided.")
            return jsonify({'error': 'Session ID not provided'}), 400

        user_message_content = user_message_text
        if images_data:
            user_message_content = user_message_text if user_message_text else "User uploaded image(s)."

        combined_pdf_text = ""

        user_message = DB_Message(text=user_message_content, sender='user', session_id=session_id, context_type='general_chat', image_data=images_data, pdf_text_content=combined_pdf_text, user_id=g.user.id)
        db.session.add(user_message)
        db.session.commit()
        db.session.refresh(g.user) # Re-bind g.user to the session after commit

        def generate_content():
            try:
                model_input_parts, is_visible_wanted = prepare_chat_input_parts(user_message_text, images_data)
                if not model_input_parts:
                    current_app.logger.error("Error: No content to generate a response from.")
                    yield "Error: No content to generate a response from."
                    return
                response = generate_chat_content_stream(model_input_parts, is_visible_wanted)
                full_bot_message_text = []
                for chunk in response:
                    if chunk.text:
                        full_bot_message_text.append(chunk.text)
                        yield chunk.text
                
                # Store the complete bot message after streaming
                bot_message = DB_Message(text="".join(full_bot_message_text), sender='bot', session_id=session_id, context_type='general_chat', user_id=g.user.id)
                with app.app_context():
                    db.session.add(bot_message)
                    db.session.commit()
                    
            except Exception as e:
                current_app.logger.error(f"Error generating content: {e}", exc_info=True)
                yield f"Error: {str(e)}"
                
        return Response(stream_with_context(generate_content()), mimetype='text/plain')
    except Exception as e:
        current_app.logger.error(f"Failed to process chat request: {e}", exc_info=True)
        return jsonify({'error': f"Internal server error: {str(e)}"}), 500

@app.route('/ask_selection', methods=['POST'])
@login_required
def ask_selection():
    selected_text = request.json.get('text')
    if not selected_text:
        return jsonify({'error': 'No text provided for asking'}), 400
    
    new_context_id = str(uuid4()) # Generate a new UUID for this selected text chat

    try:
        prompt = f"Explain this: {selected_text}"
        bot_response_text = generate_text_from_genai(prompt)

        # Store the initial user query (selected text) and bot response
        user_message = DB_Message(text=f"Selected text: {selected_text}", sender='user', context_id=new_context_id, context_type='selection_chat', user_id=g.user.id)
        bot_message = DB_Message(text=bot_response_text, sender='bot', context_id=new_context_id, context_type='selection_chat', user_id=g.user.id)
        db.session.add(user_message)
        db.session.add(bot_message)
        db.session.commit()
        db.session.refresh(g.user) # Re-bind g.user to the session after commit

        return jsonify({'response': bot_response_text, 'context_id': new_context_id}), 200
    except Exception as e:
        app.logger.error(f"Error generating content for selection: {e}")
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@app.route('/mini_chat', methods=['POST'])
@login_required
def mini_chat():
    data = request.json
    selected_text = data.get('text')
    query = data.get('query')
    context_id = data.get('context_id')
    history = data.get('history', []) 

    if not selected_text or not query or not context_id:
        return jsonify({'error': 'Missing text, query or context_id'}), 400

    # Store the user's message immediately
    user_message_db = DB_Message(text=query, sender='user', context_id=context_id, context_type='selection_chat', user_id=g.user.id)
    db.session.add(user_message_db)
    db.session.commit()
    db.session.refresh(g.user) # Re-bind g.user to the session after commit

    def generate_mini_chat_content():
        try:
            # Prepare chat history for the model, including the selected text as initial context
            chat_history_for_model = []
            # The first message in history is the initial bot response to selectedText
            if history:
                 # If the first message in the history is from the bot, add selected text as part of a user message before it
                chat_history_for_model.append({'role': 'user', 'parts': [f"Context: {selected_text}"]})
                for msg in history:
                    chat_history_for_model.append({'role': 'user' if msg['sender'] == 'user' else 'model', 'parts': [msg['text']]})

            # Start a chat with the history
            response = generate_mini_chat_content_stream(query, chat_history_for_model)
            
            full_bot_message_text = []
            for chunk in response:
                if chunk.text:
                    full_bot_message_text.append(chunk.text)
                    yield chunk.text

            # Store the complete bot message after streaming
            bot_message_db = DB_Message(text="".join(full_bot_message_text), sender='bot', context_id=context_id, context_type='selection_chat', user_id=g.user.id)
            with app.app_context():
                db.session.add(bot_message_db)
                db.session.commit()

        except Exception as e:
            app.logger.error(f"Error generating content for mini chat: {e}")
            yield f"Error: {str(e)}"
            db.session.rollback()

    return Response(stream_with_context(generate_mini_chat_content()), mimetype='text/plain')

@app.route('/save_highlight', methods=['POST'])
@login_required
def save_highlight():
    data = request.json
    phrase = data.get('phrase')
    context_id = data.get('context_id')
    session_id = data.get('session_id')

    if not phrase or not context_id or not session_id:
        return jsonify({'error': 'Missing phrase, context_id, or session_id'}), 400

    existing_highlight = DB_HighlightedPhrase.query.filter_by(context_id=context_id, user_id=g.user.id).first()
    if existing_highlight:
        # Optionally update timestamp or other fields if needed
        return jsonify({'message': 'Highlight already saved for this context_id'}), 200

    new_highlight = DB_HighlightedPhrase(phrase=phrase, context_id=context_id, session_id=session_id, user_id=g.user.id)
    db.session.add(new_highlight)
    db.session.commit()
    db.session.refresh(g.user)

    return jsonify({'message': 'Highlight saved successfully'}), 201


if __name__ == '__main__':
    app.run(debug=True) 