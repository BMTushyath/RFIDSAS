import requests
import os
from dotenv import load_dotenv

load_dotenv()

token = os.getenv("BOT_TOKEN", "8724516390:AAFqP73TQkFfMRBgh6hu5OYRlrAmAZ2REsE")
url = f"https://api.telegram.org/bot{token}/getMe"

try:
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        print(f"Bot Username: {data['result']['username']}")
    else:
        print(f"Error: {response.status_code} - {response.text}")
except Exception as e:
    print(f"Exception: {e}")
