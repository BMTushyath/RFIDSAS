DROP TABLE IF EXISTS attendance CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    rfid_id VARCHAR PRIMARY KEY,
    name VARCHAR,
    chat_id VARCHAR,
    phone VARCHAR,
    token VARCHAR,
    state VARCHAR DEFAULT 'OUTSIDE'
);
CREATE TABLE attendance (
    id SERIAL PRIMARY KEY,
    rfid_id VARCHAR REFERENCES users(rfid_id),
    timestamp TIMESTAMP,
    status VARCHAR
);


INSERT INTO users (rfid_id, name, chat_id, state) VALUES ('RFID_TUSHYATH', 'Tushyath', '6535172833', 'OUTSIDE');
INSERT INTO users (rfid_id, name, chat_id, state) VALUES ('RFID_USHA', 'Usha', '654321', 'OUTSIDE');
