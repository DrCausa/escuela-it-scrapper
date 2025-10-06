from flask import Blueprint, jsonify, Response, send_from_directory
from utils.middlewares import require_values
from typing import Any
import utils.audio_utils
import os


audios_bp = Blueprint("audios", __name__)
AUDIO_FOLDER = os.path.join("history", "audios")


@audios_bp.route("/save-audio-using-m3u8-url", methods=["POST"])
@require_values(fields=["url", "file_name"])
def save_audio_using_m3u8_url(data: Any | None) -> Response:
  try:
    file_name = utils.audio_utils.save_audio_using_m3u8_url(data["url"], data["file_name"])
    return jsonify({
      "status": "success",
      "result": file_name
    })
  except Exception as e:
    return jsonify({
      "status": "error",
      "message": str(e)
    })


@audios_bp.route("/download-saved-audio", methods=["POST"])
@require_values(fields=["file_name"])
def download_saved_audio(data: Any | None) -> Response:
  try:
    if not os.path.exists(os.path.join(AUDIO_FOLDER, data["file_name"])):
      return jsonify({
        "status": "error",
        "message": f"Audio '{data['file_name']}' not found"
      }), 404
    return send_from_directory(
      AUDIO_FOLDER,
      data["file_name"],
      as_attachment=True
    )
  except Exception:
    return jsonify({
      "status": "error",
      "message": "Unexpected error while sending file"
    }), 500


@audios_bp.route("/generate-vtt-content", methods=["POST"])
@require_values(fields=["file_name"])
def generate_vtt_content(data: Any | None) -> Response:
  file_path = os.path.join(AUDIO_FOLDER, data["file_name"])
  if not os.path.exists(file_path):
    return jsonify({
      "status": "error",
      "message": f"Audio '{data['file_name']}' not found"
    }), 404
  vtt_content = utils.audio_utils.generate_vtt_from_audio(file_path)
  if vtt_content is None:
    return jsonify({
      "status": "error",
      "message": f"Failed to generate VTT content using audio: {data['file_name']}"
    }), 500

  return jsonify({
    "status": "success",
    "result": vtt_content
  }), 200