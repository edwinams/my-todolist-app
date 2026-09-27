from flask import Flask, render_template, request, jsonify
import requests
import os

app = Flask(__name__, template_folder='../templates', static_folder='../static')

# Konfigurasi dari Environment Variables Vercel
BIN_ID = os.environ.get("JSONBIN_BIN_ID", "ID_BIN_KAMU")
API_KEY = os.environ.get("JSONBIN_API_KEY", "API_KEY_KAMU")
JSONBIN_URL = f"https://api.jsonbin.io/v3/b/{BIN_ID}"

headers = {
    'X-Master-Key': API_KEY,
    'Content-Type': 'application/json'
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/todos', methods=['GET'])
def get_todos():
    """Mengambil daftar tugas dari JSONBin"""
    try:
        response = requests.get(JSONBIN_URL, headers=headers)
        data = response.json()
        # Mengembalikan array di dalam properti 'record'
        return jsonify(data.get('record', []))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/todos', methods=['PUT'])
def update_todos():
    """Menimpa daftar tugas lama dengan daftar tugas terbaru di JSONBin"""
    try:
        new_data = request.json
        response = requests.put(JSONBIN_URL, headers=headers, json=new_data)
        return jsonify({"status": "success", "data": response.json()})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
