import google.generativeai as genai
import os
from dotenv import load_dotenv
import base64

load_dotenv()

def configure_genai():
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

def generate_text_from_genai(prompt, model_name='gemini-2.5-pro'):
    model = genai.GenerativeModel(model_name)
    response = model.generate_content(prompt)
    return response.text

def generate_chat_content_stream(history, is_visible_wanted):
    model_name = 'gemini-2.5-pro' if is_visible_wanted else 'gemini-2.5-flash-lite'
    model = genai.GenerativeModel(model_name)
    chat_session = model.start_chat(history=history[:-1]) # Pass all but the last message as history
    return chat_session.send_message(history[-1]["parts"], stream=True) # Send the last message as the current message

def generate_mini_chat_content_stream(query, chat_history_for_model):
    model = genai.GenerativeModel('gemini-2.5-pro')
    chat_session = model.start_chat(history=chat_history_for_model)
    return chat_session.send_message(query, stream=True)

def prepare_chat_input_parts(user_message_text, images_data):
    model_input_parts = []
    is_visible_wanted = False

    if images_data:
        is_visible_wanted = True
        for image_base64 in images_data:
            header, encoded = image_base64.split(",", 1)
            image_bytes = base64.b64decode(encoded)
            model_input_parts.append({'mime_type': header.split(":")[1].split(";")[0], 'data': image_bytes})

        if not user_message_text:
            user_message_text = "Analyze the provided content." # Add a default prompt if only files are provided

    if user_message_text:
        model_input_parts.append(user_message_text)
    
    return model_input_parts, is_visible_wanted