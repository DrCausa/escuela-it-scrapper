from flask import Blueprint, jsonify, Response
from utils.middlewares import require_json_value
from utils.json_utils import get_json, ovewrite_json
from typing import Any
import os


data_pb = Blueprint("data", __name__)
HISTORY_FOLDER = os.path.join("history")


@data_pb.route("/add-to-history", methods=["POST"])
@require_json_value
def add_to_history(value: Any) -> Response:
  file_path = os.path.join(HISTORY_FOLDER, "data.json")

  if not os.path.exists(HISTORY_FOLDER):
    os.makedirs(HISTORY_FOLDER, exist_ok=True)

  new_data = get_json(file_path) or []
  new_data.append(value)

  if ovewrite_json(file_path, new_data):
    return jsonify({
      "status": "success",
      "message": "Data added to history successfully"
    }), 200
  
  return jsonify({
    "status": "error",
    "message": "Failed to add data to history"
  }), 500


@data_pb.route("/get-history", methods=["GET"])
def get_history() -> Response:
  file_path = os.path.join(HISTORY_FOLDER, "data.json")

  data = get_json(file_path) or []
  if data:
    return jsonify(data), 200
  
  return jsonify({
    "status": "error",
    "message": "Failed to retrieve history data"
  })

