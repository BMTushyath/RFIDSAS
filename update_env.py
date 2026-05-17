import urllib.request
import urllib.error
import json
import os

NGROK_API_URL = "http://127.0.0.1:4040/api/tunnels"
# Assumes this script is in c:\kafka, so frontend is c:\kafka\frontend
FRONTEND_ENV_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "frontend", ".env")

def get_ngrok_url():
    try:
        req = urllib.request.Request(NGROK_API_URL)
        with urllib.request.urlopen(req, timeout=5) as response:
            data = json.loads(response.read().decode())
    except urllib.error.URLError:
        print("Error: Could not connect to ngrok API at 127.0.0.1:4040")
        print("Please ensure you have started ngrok first (e.g., 'ngrok http 8000').")
        return None
    except Exception as e:
        print(f"Error fetching ngrok tunnels: {e}")
        return None

    tunnels = data.get("tunnels", [])
    if not tunnels:
        print("Error: Connected to ngrok API, but no tunnels are currently active.")
        return None

    for t in tunnels:
        # Check for HTTPS tunnel and port 8000 in the address
        if t.get("proto") == "https" and "8000" in str(t.get("config", {}).get("addr", "")):
            return t.get("public_url")
            
    print("Error: Could not find an active HTTPS tunnel for port 8000.")
    print("Found tunnels:")
    for t in tunnels:
        print(f" - {t.get('public_url')} -> {t.get('config', {}).get('addr')}")
    return None

def update_env(backend_url):
    try:
        os.makedirs(os.path.dirname(FRONTEND_ENV_PATH), exist_ok=True)
        
        env_content = ""
        # Read existing content if file exists so we don't accidentally overwrite other potential variables
        if os.path.exists(FRONTEND_ENV_PATH):
            with open(FRONTEND_ENV_PATH, "r") as f:
                lines = f.readlines()
            for line in lines:
                # Keep all lines except the one we are replacing
                if not line.startswith("VITE_BACKEND_URL="):
                    env_content += line
                    
        # Ensure proper spacing
        if env_content and not env_content.endswith("\n"):
            env_content += "\n"
            
        env_content += f"VITE_BACKEND_URL={backend_url}\n"
        
        with open(FRONTEND_ENV_PATH, "w") as f:
            f.write(env_content)
            
        print("\nSUCCESS!")
        print(f"Updated {FRONTEND_ENV_PATH} with:\nVITE_BACKEND_URL={backend_url}")
        print("\nYou can now start your frontend server.")
    except Exception as e:
        print(f"Error writing to {FRONTEND_ENV_PATH}: {e}")

if __name__ == "__main__":
    print("Detecting ngrok backend URL...")
    url = get_ngrok_url()
    if url:
        print(f"Found active backend tunnel: {url}")
        update_env(url)
    else:
        print("\nFailed to setup frontend environment. Please resolve the issue and run this script again.")
