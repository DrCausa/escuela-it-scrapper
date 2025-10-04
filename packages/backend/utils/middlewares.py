from functools import wraps
from flask import request, jsonify
from re import fullmatch
from json import loads, JSONDecoder


def require_url(f):
  @wraps(f)
  def decorated_function(*args, **kwargs):
    data = request.get_json(silent=True) or {}
    url = data.get("url")
    if not url:
      return jsonify({
        "status": "error",
        "message": "The 'url' is missing from the request"
      }), 400
    return f(url, *args, **kwargs)
  return decorated_function


def require_escuelait_url(f):
  @wraps(f)
  @require_url
  def decorated_function(url, *args, **kwargs):
    pattern = r"^https:\/\/escuela.it\/cursos\/(.+)\/clase\/(.+)$"
    if not fullmatch(pattern, url):
      return jsonify({
        "status": "error",
        "message": "The 'url' is not a valid EscuelaIT class URL"
      }), 400
    return f(url, *args, **kwargs)
  return decorated_function


def require_texttrack_url(f):
  @wraps(f)
  @require_url
  def decorated_function(url, *args, **kwargs):
    pattern = r"https:\/\/player.vimeo.com\/texttrack\/(\d+)\.vtt\?token=(.+)"
    if not fullmatch(pattern, url):
      return jsonify({
        "status": "error",
        "message": "The 'url' is not a valid Vimeo text track URL"
      }), 400
    return f(url, *args, **kwargs)
  return decorated_function


def require_value(f):
  @wraps(f)
  def decorated_function(*args, **kwargs):
    data = request.get_json(silent=True) or {}
    value = data.get("value")
    if not value:
      return jsonify({
        "status": "error",
        "message": "The 'value' is missing from the request"
      }), 400
    return f(value, *args, **kwargs)
  return decorated_function


def require_values(fields=None):
  fields = fields or []

  def decorator(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
      data = request.get_json(silent=True)
      if not data or not isinstance(data, dict):
        return jsonify({
          "status": "error",
          "message": "The body must be a valid JSON"
        }), 400
      
      missing_fields = [field for field in fields if field not in data]
      if missing_fields:
        return jsonify({
          "status": "error",
          "message": f"Required fields are missing: {', '.join(missing_fields)}"
        }), 400
      return f(data, *args, **kwargs)
    return decorated_function
  return decorator


def require_vtt_value(f):
  @wraps(f)
  @require_value
  def decorated_function(value, *args, **kwargs):
    pattern = r'(WEBVTT\s\n)?(\d+\n\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}\s.+\n*)+'
    if not fullmatch(pattern, value):
      return jsonify({
        "status": "error",
        "message": "The 'value' is not a valid VTT content"
      }), 400
    return f(value, *args, **kwargs)
  return decorated_function


def require_json_value(f):
  @wraps(f)
  @require_value
  def decorated_function(value, *args, **kwargs):
    try:
      parsed_value = loads(value) if isinstance(value, str) else value
    except (JSONDecoder, TypeError):
      return jsonify({
        "status": "error",
        "message": "The 'value' must be a valid JSON string"
      }), 400
    return f(parsed_value, *args, **kwargs)
  return decorated_function