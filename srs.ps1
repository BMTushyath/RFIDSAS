Write-Host "----------------------------------------"
Write-Host "Starting RFID Kafka System"
Write-Host "----------------------------------------"

$kafkaPath = "C:\kafka\bin\windows"

Write-Host "Starting Kafka Controller..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cmd /k `"title KAFKA CONTROLLER && cd /d C:\kafka\bin\windows && kafka-server-start.bat ..\..\config\controller.properties`""

Start-Sleep -Seconds 10

Write-Host "Starting Kafka Broker..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cmd /k `"title KAFKA BROKER && cd /d C:\kafka\bin\windows && kafka-server-start.bat ..\..\config\broker.properties`""

Write-Host "Waiting for broker to be ready..."
$ready = $false
while (-not $ready) {
    try {
        $test = & "$kafkaPath\kafka-topics.bat" --list --bootstrap-server localhost:9092 2>$null
        $ready = $true
    }
    catch {
        Start-Sleep -Seconds 5
    }
}

Write-Host "Kafka broker is ready."

Write-Host "Creating topic if needed..."
& "$kafkaPath\kafka-topics.bat" --create --topic rfid-events --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1 2>$null

Start-Sleep -Seconds 3

Write-Host "Starting Consumer..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cmd /k `"title KAFKA CONSUMER && cd /d C:\kafka\bin\windows && kafka-console-consumer.bat --topic rfid-events --bootstrap-server localhost:9092 --from-beginning`""

Start-Sleep -Seconds 3

Write-Host "Starting Producer..."
Start-Process powershell -ArgumentList "-NoExit","-Command","cmd /k `"title KAFKA PRODUCER && cd /d C:\kafka\bin\windows && kafka-console-producer.bat --topic rfid-events --bootstrap-server localhost:9092`""

Write-Host ""
Write-Host "----------------------------------------"
Write-Host "SYSTEM READY"
Write-Host "Producer terminal accepts RFID input"
Write-Host "----------------------------------------"