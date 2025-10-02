import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from scrapper import getSrcURL
from json_manager import read_json, write_json
from formatter import formatter, get_TextFormatted, vtt_to_srt

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
  format_type = data.get("format", "txt")  # txt | srt | summary




  if not url:
    return jsonify({
      "status": "error",
      "message": "The 'url' parameter is missing from the request."
    })
  try:
    req = requests.get(url)
    req.raise_for_status()
    raw_text = req.text

    # Selección por formato
    if format_type == "summary":
      # usar servicio Gemini para formateo/resumen avanzado
      content = get_TextFormatted(raw_text)
    elif format_type == "srt":
      # convertir WebVTT a SRT
      content = vtt_to_srt(raw_text)
    else:
      # txt plano (con o sin timestamps)
      if hasTime:
        # txt con timestamps formateados por Gemini
        content = get_TextFormatted(raw_text)
      else:
        # limpieza básica a texto plano
        content = formatter(raw_text)





    print(content)
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

@app.route("/format", methods=["POST"])
def format_transcript():
    data = request.json
    transcript = data.get("transcript")

    if not transcript:
        return jsonify({
            "status": "error",
            "message": "No transcript provided"
        })

    try:
        # Llamar al servicio Node (gemini-service)
        response = requests.post(
            "http://localhost:4000/format",  # tu gemini-service en Node
            json={"transcript": transcript}
        )
        response.raise_for_status()

        return jsonify({
            "status": "success",
            "result": response.json()
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        })