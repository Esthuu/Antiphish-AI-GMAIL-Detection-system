from flask import Flask, request, jsonify
import google.generativeai as genai
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

genai.configure(api_key="YOUR_API_KEY")

model = genai.GenerativeModel("gemini-pro")

@app.route("/analyze", methods=["POST"])
def analyze():
    text = request.json.get("text", "")

    prompt = f"""
    Is this email phishing? Answer briefly.

    "{text}"
    """

    try:
        res = model.generate_content(prompt)
        return jsonify({"result": res.text})
    except:
        return jsonify({"result": "AI error"})

app.run(port=5000)