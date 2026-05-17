import os
import requests

BOT_TOKEN = os.getenv("BOT_TOKEN", "8724516390:AAFqP73TQkFfMRBgh6hu5OYRlrAmAZ2REsE")

def send_message(chat_id, student_name, scan_time, action):
    """
    Sends a telegram message using the Telegram Bot API using the requests library.
    """
    message = f"Student {student_name} has {action} at {scan_time}"
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": chat_id,
        "text": message
    }
    
    try:
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.exceptions.RequestException as e:
        return False
