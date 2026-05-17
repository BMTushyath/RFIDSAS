import os
import psycopg
from psycopg.rows import dict_row
from dotenv import load_dotenv

# Ensure environment variables are loaded
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

def get_connection():
    """Create and return an ephemeral psycopg connection."""
    conn = psycopg.connect(
        host=os.getenv("DB_HOST", "localhost"),
        dbname=os.getenv("DB_NAME", "rfid_db"),
        user=os.getenv("DB_USER", "postgres"),
        password=os.getenv("DB_PASSWORD"),
        port=os.getenv("DB_PORT", "5432"),
        row_factory=dict_row
    )
    return conn

def get_user_info(rfid_id):
    """Search for the RFID user in the Postgres database."""
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            # Fully parameterized query to prevent SQL injection
            cur.execute("SELECT name, chat_id, state FROM users WHERE rfid_id = %s;", (rfid_id,))
            result = cur.fetchone()
            # result is a dict because of row_factory=dict_row
            if result:
                return result['name'], result['chat_id'], result.get('state', 'OUTSIDE')
            return None
    finally:
        if conn:
            conn.close()

def record_attendance_in_db(rfid_id, scan_time, status):
    """Record attendance in the attendance table with system timestamp and status."""
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO attendance (rfid_id, timestamp, status) VALUES (%s, %s, %s);",
                (rfid_id, scan_time, status)
            )
        conn.commit()
    finally:
        if conn:
            conn.close()

def update_user_state(rfid_id, new_state):
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET state = %s WHERE rfid_id = %s;", (new_state, rfid_id))
        conn.commit()
    finally:
        if conn:
            conn.close()

def register_new_user(name, phone, rfid_id, token):
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute(
                "INSERT INTO users (rfid_id, name, phone, token, state) VALUES (%s, %s, %s, %s, 'OUTSIDE');",
                (rfid_id, name, phone, token)
            )
        conn.commit()
    finally:
        if conn:
            conn.close()

def link_telegram_chat(token, chat_id):
    conn = None
    try:
        conn = get_connection()
        with conn.cursor() as cur:
            cur.execute("UPDATE users SET chat_id = %s WHERE token = %s;", (chat_id, token))
            cur.execute("SELECT name FROM users WHERE token = %s;", (token,))
            res = cur.fetchone()
            if res:
                conn.commit()
                return res['name']
            return None
    finally:
        if conn:
            conn.close()
