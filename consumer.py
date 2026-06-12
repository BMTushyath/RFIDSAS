import os
from datetime import datetime
from kafka import KafkaConsumer

# Import the Postgres DB interface
from database.db import get_user_info, record_attendance_in_db, update_user_state

# Import the notification function
from notifications.telegram_sender import send_message


def main():
    topic_name = 'rfid-events'
    bootstrap_servers = ['localhost:9092']
    
    # Connect to Kafka topic "rfid-events"
    consumer = KafkaConsumer(
        topic_name,
        bootstrap_servers=bootstrap_servers,
        auto_offset_reset='latest',
        enable_auto_commit=True,
        value_deserializer=lambda x: x.decode('utf-8')
    )
    
    print("Listening for RFID events on 'rfid-events' topic...")
    
    # Continuously listen for RFID UID messages
    for message in consumer:
        rfid_id = message.value.strip()
        print(f"\nRFID Number Received: {rfid_id}")
        
        # Search the UID in the Postgres users table
        user_info = get_user_info(rfid_id)
        
        if user_info:
            # If found: Get name, chat_id, and state
            student_name, parent_chat_id, current_state = user_info
            
            # Use system time for scan_time
            scan_time = datetime.now()
            
            # FSM Logic
            if current_state == "OUTSIDE":
                new_state = "INSIDE"
                status = "ENTRY"
                telegram_action = "ENTERED"
            else:
                new_state = "OUTSIDE"
                status = "EXIT"
                telegram_action = "EXITED"
                
            # Update user state
            update_user_state(rfid_id, new_state)
            
            # Record attendance in PostgreSQL attendance table
            record_attendance_in_db(rfid_id, scan_time, status)
            
            # Format time for display and telegram as '09:42 AM'
            formatted_time = scan_time.strftime("%I:%M %p")
            print(f"User Found: {student_name}")
            print(f"Status: {status}")
            print(f"Attendance Recorded at {formatted_time}")
            
            if parent_chat_id:
                # Send Telegram message immediately
                success = send_message(parent_chat_id, student_name, formatted_time, telegram_action)
                if success:
                    print("Telegram Message Sent")
                else:
                    print("Failed to send Telegram message")
            else:
                print("No Telegram chat_id linked. Skipping message.")
        else:
            # If UID not found
            print("Unknown RFID card")

if __name__ == '__main__':
    main()
