from flask import Flask, request

app = Flask(__name__)

@app.route("/device-data", methods=["POST"])
def receive_data():
    data = request.json
    print("Received:", data)
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)