import os
import time
import requests
from dotenv import load_dotenv
from database.db import link_telegram_chat

# Load environment variables
load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN", "8724516390:AAFqP73TQkFfMRBgh6hu5OYRlrAmAZ2REsE")
BASE_URL = f"https://api.telegram.org/bot{BOT_TOKEN}"

def send_message(chat_id, text):
    url = f"{BASE_URL}/sendMessage"
    payload = {"chat_id": chat_id, "text": text}
    try:
        requests.post(url, json=payload, timeout=5)
    except Exception as e:
        print(f"Error sending message: {e}")

def handle_updates():
    last_update_id = 0
    print("Bot is polling for updates...")
    
    while True:
        try:
            url = f"{BASE_URL}/getUpdates"
            params = {"offset": last_update_id + 1, "timeout": 30}
            response = requests.get(url, params=params, timeout=35)
            
            if response.status_code == 200:
                updates = response.json().get("result", [])
                
                for update in updates:
                    last_update_id = update["update_id"]
                    message = update.get("message")
                    
                    if not message or "text" not in message:
                        continue
                        
                    chat_id = message["chat"]["id"]
                    text = message["text"]
                    
                    if text.startswith("/start"):
                        parts = text.split()
                        if len(parts) > 1:
                            token = parts[1]
                            print(f"Received token: {token} from chat_id: {chat_id}")
                            
                            # Update DB
                            user_name = link_telegram_chat(token, chat_id)
                            
                            if user_name:
                                send_message(chat_id, f"✅ Connected successfully, {user_name}! You will now receive attendance updates.")
                            else:
                                send_message(chat_id, "❌ Invalid or expired token. Please try registering again.")
                        else:
                            send_message(chat_id, "❌ Please use the registration link provided on the website to start.")
                            
            elif response.status_code == 401:
                print("Error: Invalid BOT_TOKEN. Please check your .env file.")
                break
                
        except Exception as e:
            print(f"Polling error: {e}")
            
        time.sleep(1)

if __name__ == "__main__":
    handle_updates()
