@echo off
echo ==========================================
echo Starting RFID Kafka Pipeline
echo ==========================================

echo Starting PostgreSQL locally...
start "PostgreSQL" /MIN powershell -WindowStyle Hidden -Command "& 'C:\Program Files\PostgreSQL\16\bin\postgres.exe' -D 'c:\kafka\database\pgdata' *>> 'c:\kafka\database\pg_log.txt'"

echo Waiting for database to initialize (3 seconds)...
timeout /t 3 /nobreak > nul

echo Starting Kafka Server...
start "Kafka Server" powershell -NoExit -Command "Set-Location -LiteralPath '%~dp0'; .\bin\windows\kafka-server-start.bat .\config\server.properties"

echo Waiting for Kafka to initialize (15 seconds)...
timeout /t 15 /nobreak > nul

echo Starting Kafka Consumer...
start "Kafka Consumer" powershell -NoExit -Command "Set-Location -LiteralPath '%~dp0'; python consumer.py"

echo Starting Telegram Bot...
start "Telegram Bot" powershell -NoExit -Command "Set-Location -LiteralPath '%~dp0'; python telegram_bot.py"

echo Starting FastAPI Backend...
start "FastAPI Backend" powershell -NoExit -Command "Set-Location -LiteralPath '%~dp0'; uvicorn backend.main:app --host 0.0.0.0 --port 8000"

echo Starting Backend Public Tunnel (Ngrok)...
start "Backend Public URL" powershell -NoExit -Command "ngrok http 8000"

echo Waiting for Ngrok to connect (5 seconds)...
timeout /t 5 /nobreak > nul

echo Starting Kafka Producer...
start "Kafka Producer" powershell -NoExit -Command "Set-Location -LiteralPath '%~dp0'; python producer.py"

echo.
echo All components launched successfully!
echo V2 System is ready: Registration -> Telegram Link -> RFID Scan.
echo ==========================================
