import time
import sys
from kafka import KafkaProducer

def main():
    try:
        producer = KafkaProducer(
            bootstrap_servers=['localhost:9092'],
            value_serializer=lambda x: x.encode('utf-8')
        )
    except Exception as e:
        print(f"Failed to connect to Kafka: {e}")
        sys.exit(1)
        
    print("--- RFID Scanner (Producer) ---")
    print("Please click or tap to place the cursor in this terminal.")
    print("Scan your physical RFID card (the reader acts like a keyboard).")
    print("Type 'exit' or hit Ctrl+C to quit.\n")
    
    try:
        while True:
            uid = input("Scan RFID UID: ").strip()
            if uid.lower() == 'exit':
                break
            if not uid:
                continue
                
            print(f"Sending UID: {uid} to Kafka 'rfid-events' topic...")
            producer.send('rfid-events', value=uid)
            producer.flush()
    except KeyboardInterrupt:
        print("\nExiting producer...")
    finally:
        producer.close()

if __name__ == '__main__':
    main()
