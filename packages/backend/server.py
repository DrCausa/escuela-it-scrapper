import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from scrapper import getSrcURL
from json_manager import read_json, write_json
from formatter import formatter

app = Flask(__name__)
CORS(app)

@app.route("/scrape", methods=["POST"])
def scrape():
  data = request.json
  url = data.get("url")
  if not url:
    return jsonify({
      "status": "error",
      "message": "The 'url' parameter is missing from the request."
    })
  res = getSrcURL(url)
  if (res["status"] == "error"):
    return jsonify({
      "status": "error",
      "message": res["message"]
    })
  return jsonify({
    "status": "success",
    "result": res["result"]
  })

@app.route("/get-content", methods=["POST"])
def get_content():
  data = request.json
  url = data.get("url")
  hasTime = data.get("hasTime", True)

  if not url:
    return jsonify({
      "status": "error",
      "message": "The 'url' parameter is missing from the request."
    })
  try:
    req = requests.get(url)
    req.raise_for_status()
    content = req.text if hasTime else formatter(req.text)
    return jsonify({
      "status": "success",
      "result": content
    })
  except Exception as e:
    return jsonify({
      "status": "error",
      "message": str(e)
    })

@app.route("/save-results", methods=["POST"])
def save_results():
  data = request.json
  content = data.get("newData")
  if not content:
    return jsonify({
      "status": "error",
      "message": "missing content"
    })
  old_data = read_json("data.json") or []
  old_data.append(content)

  if (write_json("data.json", old_data)):
    return jsonify({
      "status": "success",
      "message": "saved successfully"
    })
  else:
    return jsonify({
      "status": "error",
      "message": "failed to save"
    })

@app.route("/get-results", methods=['GET'])
def get_results():
  data = read_json("data.json")
  if data is None:
    return jsonify({
      "status": "error",
      "message": "no data found"
    })
  return jsonify({
    "status": "success",
    "result": data
  })

if __name__ == "__main__":
  app.run(debug=True, port=5000)