from flask import Blueprint, jsonify, Response
from utils.middlewares import require_escuelait_url, require_texttrack_url


utils_bp = Blueprint("utils", __name__)


@utils_bp.route("/is-valid-escuelait-url", methods=["POST"])
@require_escuelait_url
def is_valid_escuelait_url(url: str) -> Response:
  return jsonify({
    "status": "success",
    "result": True
  }), 200


@utils_bp.route("/is-valid-texttrack-url", methods=["POST"])
@require_texttrack_url
def is_valid_texttrack_url(url: str) -> Response:
  return jsonify({
    "status": "success",
    "result": True
  }), 200