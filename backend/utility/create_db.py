from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

# Define Message Model
def create_database(db: SQLAlchemy):
    class User(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(80), unique=True, nullable=False)
        password = db.Column(db.String(200), nullable=False) # Store hashed passwords

        def __repr__(self):
            return '<User %r>' % self.username

    class Message(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False) # Link to User model
        user = db.relationship('User', backref='messages')
        session_id = db.Column(db.String(36), nullable=True)  # Store UUIDs, nullable for mini-chatbot
        context_id = db.Column(db.String(36), nullable=True) # New: Store UUIDs for mini-chatbot context
        context_type = db.Column(db.String(50), nullable=True) # New: 'general_chat' or 'selection_chat'
        sender = db.Column(db.String(50), nullable=False)
        text = db.Column(db.String(5000), nullable=False)
        image_data = db.Column(db.JSON, nullable=True) # New: Store base64 encoded image data as JSON array
        pdf_text_content = db.Column(db.Text, nullable=True) # New: Store extracted PDF text content
        timestamp = db.Column(db.DateTime, default=datetime.utcnow)

        def to_dict(self):
            return {
                'id': self.id,
                'user_id': self.user_id,
                'session_id': self.session_id,
                'context_id': self.context_id,
                'context_type': self.context_type,
                'sender': self.sender,
                'text': self.text,
                'image_data': self.image_data, # Include image data in dict
                'timestamp': self.timestamp.isoformat()
            }

    class HighlightedPhrase(db.Model):
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
        user = db.relationship('User', backref='highlights')
        session_id = db.Column(db.String(36), nullable=False)
        context_id = db.Column(db.String(36), nullable=False) # The context_id from the mini-chat
        phrase = db.Column(db.String(500), nullable=False)
        timestamp = db.Column(db.DateTime, default=datetime.utcnow)

        def to_dict(self):
            return {
                'id': self.id,
                'user_id': self.user_id,
                'session_id': self.session_id,
                'context_id': self.context_id,
                'phrase': self.phrase,
                'timestamp': self.timestamp.isoformat()
            }

    return Message, User, HighlightedPhrase