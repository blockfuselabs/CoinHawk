
import websocket
import threading
import json
import time

def on_message(ws, message):
    print(f"\n🟢 Received: {message}\n")

def on_error(ws, error):
    print(f"\n🔴 Error: {error}\n")

def on_close(ws, close_status_code, close_msg):
    print("\n🔵 Connection closed\n")

def on_open(ws):
    def run():
        while True:
            question = input("Ask a question: ")
            data = {
                "tokenAddress": "0x2272ed9c92024da2589b3f21afd39aaf0690d88e",
                "userMessage": question
            }
            ws.send(json.dumps(data))
            time.sleep(1)

    threading.Thread(target=run).start()

# Setup WebSocket connection
websocket.enableTrace(False)
ws = websocket.WebSocketApp("ws://localhost:3000",
                            on_open=on_open,
                            on_message=on_message,
                            on_error=on_error,
                            on_close=on_close)

ws.run_forever()
