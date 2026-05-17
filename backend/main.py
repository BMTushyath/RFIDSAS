import os
import uuid
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from database.db import register_new_user
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RegisterRequest(BaseModel):
    name: str
    phone: str
    rfid_id: str

@app.post("/register")
async def register(request: RegisterRequest):
    try:
        # Generate unique token
        token = str(uuid.uuid4())
        
        # Insert into database
        register_new_user(request.name, request.phone, request.rfid_id, token)
        
        # Bot username from env or default
        bot_username = os.getenv("BOT_USERNAME", "RFIDSAS_BOT") # Adjust this to your actual bot username
        telegram_link = f"https://t.me/{bot_username}?start={token}"
        
        return {"telegram_link": telegram_link}
    except Exception as e:
        print(f"Registration error: {e}")
        raise HTTPException(status_code=500, detail="Registration failed")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
