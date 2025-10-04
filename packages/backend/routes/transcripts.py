from flask import Blueprint, request, jsonify, Response
from utils.middlewares import require_texttrack_url, require_vtt_value
from utils.http_utils import get_raw_content
from utils.text_utils import flatten_text


transcripts_bp = Blueprint("transcripts", __name__)


@transcripts_bp.route("/get-vtt-content", methods=["POST"])
@require_texttrack_url
def get_vtt_content(url: str) -> Response:
  data = request.get_json(silent=True) or {}
  url = data.get("url")

  raw_content = get_raw_content(url)
  if raw_content == None:
    return jsonify({
      "status": "error",
      "message": "There was an ambiguous exception that occurred while handling your request"
    }), 500
  
  return jsonify({
    "status": "success",
    "result": raw_content
  }), 200


@transcripts_bp.route("/vvt-to-plain-text", methods=["POST"])
@require_vtt_value
def vvt_to_plain_text(url: str) -> Response:
  data = request.get_json(silent=True) or {}
  value = data.get("value")

  plain_value = flatten_text(value)
  return jsonify({
    "status": "success",
    "result": plain_value
  }), 200