
# Crypto Token Analysis Client

This project includes a `client.py` script that connects to a WebSocket server to send token data and receive professional analysis from an AI assistant.

## 📦 Requirements

Before running the client, make sure you have the following installed:

- Python 3.7+
- `websockets` library
- `asyncio` (included with Python 3.7+)


Install dependencies with:

```bash
pip install websockets 
🚀 Running the Client
The client connects to a WebSocket server and sends token data for analysis.

1. Start the WebSocket Server
Make sure the WebSocket server is running and listening at the correct endpoint.
npm run start
Or make sure your deployment is live if connecting to a remote endpoint.

2. Update Configuration
In simple_client.py, make sure to set the correct WebSocket URL:

uri = "ws://localhost:3000/" 
3. Run the Client
Now you can run the client:
python simple_client.py
The client will send the token data and receive AI-powered analysis. The output will be printed to your terminal.