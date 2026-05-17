# RFID Attendance System

A complete Python-based RFID attendance backend system that integrates Apache Kafka, SQLite database, and Telegram notifications.

## Project Structure
- `consumer.py`: Connects to Kafka, reads RFID events, records attendance in the database, and sends Telegram notifications.
- `database/init_db.py`: Initializes the SQLite database and populates it with example student records.
- `notifications/telegram_sender.py`: Handles sending notification messages via Telegram Bot API using the `requests` module.
- `producer.py`: Simple Python script to send test RFID UIDs to the Kafka topic.

## Usage
1. Install dependencies: `pip install -r requirements.txt`
2. Initialize database: `python database/init_db.py`
3. Ensure Apache Kafka is running and accessible at `localhost:9092` with topic `rfid-events`.
4. Run consumer: `python consumer.py`
5. Test producer: `python producer.py`
