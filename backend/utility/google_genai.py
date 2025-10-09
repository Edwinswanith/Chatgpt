import google.generativeai as genai
import os
from dotenv import load_dotenv
import base64
from threading import Lock

load_dotenv()

_MODEL_CACHE = {}
_MODEL_CACHE_LOCK = Lock()


def configure_genai():
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))


def _get_model(model_name: str) -> genai.GenerativeModel:
    """Return a cached GenerativeModel instance for the requested name."""
    with _MODEL_CACHE_LOCK:
        model = _MODEL_CACHE.get(model_name)
        if model is None:
            model = genai.GenerativeModel(model_name)
            _MODEL_CACHE[model_name] = model
        return model


def generate_text_from_genai(prompt, model_name='gemini-2.5-pro'):
    model = _get_model(model_name)
    response = model.generate_content(prompt)
    return response.text


def generate_chat_content_stream(model_input_parts, is_visible_wanted):
    model_name = 'gemini-2.5-pro' if is_visible_wanted else 'gemini-2.5-flash-lite'
    model = _get_model(model_name)
    return model.generate_content(model_input_parts, stream=True)


def generate_mini_chat_content_stream(query, chat_history_for_model):
    model = _get_model('gemini-2.5-pro')
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
            model_input_parts.append({
                'mime_type': header.split(":")[1].split(";")[0],
                'data': image_bytes,
            })

        if not user_message_text:
            # Add a default prompt if only files are provided
            user_message_text = "Analyze the provided content."

    if user_message_text:
        model_input_parts.append(user_message_text)

    return model_input_parts, is_visible_wanted
