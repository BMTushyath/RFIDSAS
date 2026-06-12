import os
import sqlite3
import logging
from datetime import datetime, timedelta

# Path for the SQLite pending database (stored alongside other DB files)
PENDING_DB_PATH = os.path.join(os.path.dirname(__file__), "pending.db")

# Configure basic logging for this module
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

def get_connection():
    """Create a SQLite connection to the pending database."""
    conn = sqlite3.connect(PENDING_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_pending_db():
    """Initialize the pending_users table if it does not exist."""
    conn = get_connection()
    try:
        conn.execute(
            """
            CREATE TABLE IF NOT EXISTS pending_users (
                token TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT NOT NULL,
                rfid_id TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
            """
        )
        conn.commit()
        logger.info("Initialized pending registrations database.")
    finally:
        conn.close()

def add_pending_user(token: str, name: str, phone: str, rfid_id: str) -> None:
    """Insert a pending user record and clean up expired tokens."""
    conn = get_connection()
    try:
        conn.execute(
            "INSERT OR REPLACE INTO pending_users (token, name, phone, rfid_id) VALUES (?, ?, ?, ?);",
            (token, name, phone, rfid_id),
        )
        conn.commit()
        logger.info(f"Token Generated: {token} for RFID: {rfid_id}, Name: {name}")
    finally:
        conn.close()
    cleanup_expired_tokens()

def get_pending_user(token: str):
    """Retrieve a pending user record by token. Returns a dict or None if not found/expired."""
    conn = get_connection()
    try:
        cur = conn.execute(
            "SELECT token, name, phone, rfid_id, created_at FROM pending_users WHERE token = ?;",
            (token,),
        )
        row = cur.fetchone()
        if row:
            # Check expiration (default 10 minutes)
            created = datetime.fromisoformat(row["created_at"])
            if datetime.utcnow() - created > timedelta(minutes=10):
                logger.info(f"Expired token access attempt: {token}")
                delete_pending_user(token)
                return None
            return {"token": row["token"], "name": row["name"], "phone": row["phone"], "rfid_id": row["rfid_id"]}
        return None
    finally:
        conn.close()

def delete_pending_user(token: str) -> None:
    """Remove a pending user token from the store."""
    conn = get_connection()
    try:
        conn.execute("DELETE FROM pending_users WHERE token = ?;", (token,))
        conn.commit()
        logger.info(f"Token Invalidated: {token}")
    finally:
        conn.close()

def cleanup_expired_tokens(expiry_minutes: int = 10) -> None:
    """Delete tokens older than expiry_minutes and log the cleanup."""
    cutoff = datetime.utcnow() - timedelta(minutes=expiry_minutes)
    conn = get_connection()
    try:
        cur = conn.execute(
            "SELECT token FROM pending_users WHERE created_at < ?;",
            (cutoff.isoformat(),),
        )
        expired = [row["token"] for row in cur.fetchall()]
        if expired:
            conn.execute(
                "DELETE FROM pending_users WHERE created_at < ?;",
                (cutoff.isoformat(),),
            )
            conn.commit()
            for t in expired:
                logger.info(f"Expired token cleaned up: {t}")
    finally:
        conn.close()

# Initialize on import
init_pending_db()
