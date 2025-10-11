

def get_chat_history(user_id, session_id, DB_Message, db):
    """
    Retrieves the chat history for a given user and session.
    Returns a list of messages in the format expected by the GenAI model.
    """
    messages = DB_Message.query.filter_by(user_id=user_id, session_id=session_id, context_type='general_chat').order_by(DB_Message.timestamp).all()
    chat_history = []
    for msg in messages:
        chat_history.append({"role": msg.sender, "content": msg.text})
    return chat_history

def append_to_chat_history(
    user_id,
    session_id,
    role,
    content,
    DB_Message,
    db,
    *,
    context_id=None,
    context_type='general_chat',
    image_data=None,
    pdf_text_content=None,
):
    """
    Appends a new message to the chat history for a given user and session.
    """
    new_message = DB_Message(
        user_id=user_id,
        session_id=session_id,
        context_id=context_id,
        context_type=context_type,
        sender=role,
        text=content,
        image_data=image_data,
        pdf_text_content=pdf_text_content,
    )
    db.session.add(new_message)
    db.session.commit()
