from flask import Blueprint, request, jsonify, Response
from utils.middlewares import require_escuelait_url
from utils.selenium_utils import get_track_src, get_chrome_driver, get_iframe_video


videos_bp = Blueprint("videos", __name__)


@videos_bp.route("/get-texttrack-url", methods=["POST"])
@require_escuelait_url
def get_texttrack_url(url: str) -> Response:
  driver = None
  try:
    driver = get_chrome_driver()
    driver.implicitly_wait(10)
    driver.get(url)

    iframe = get_iframe_video(driver)
    driver.switch_to.frame(iframe)
    track_src = get_track_src(driver)

    return jsonify({
      "status": "success",
      "result": track_src
    }), 200
  except Exception:
    return jsonify({
      "status": "error",
      "message": "An error occurred while processing the request"
    }), 500
  finally:
    if driver:
      driver.quit()