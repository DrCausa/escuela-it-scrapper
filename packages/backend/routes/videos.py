from flask import Blueprint, jsonify, Response
from utils.middlewares import require_escuelait_url
from utils.selenium_utils import get_track_src, get_chrome_driver, get_iframe_video, get_scripts, get_player_config_from_script, get_meu8_url_using_player_config


videos_bp = Blueprint("videos", __name__)


@videos_bp.route("/get-texttrack-url", methods=["POST"])
@require_escuelait_url
def get_texttrack_url(url: str) -> Response:
  driver = None
  try:
    driver = get_chrome_driver()
    driver.implicitly_wait(8)
    driver.get(url)

    iframe = get_iframe_video(driver)
    driver.switch_to.frame(iframe)
    
    track_src = get_track_src(driver)
    if track_src is None:
      return jsonify({
        "status": "success",
        "message": False
      }), 500

    return jsonify({
      "status": "success",
      "result": track_src
    }), 200
  except:
    return jsonify({
      "status": "error",
      "message": "An error occurred while processing the request"
    }), 500
  finally:
    if driver:
      driver.quit()


@videos_bp.route("/get-m3u8-url", methods=["POST"])
@require_escuelait_url
def get_m3u8_url(url: str) -> Response:
  driver = None
  try:
    driver = get_chrome_driver()
    driver.implicitly_wait(8)
    driver.get(url)

    iframe = get_iframe_video(driver)
    driver.switch_to.frame(iframe)
    scripts = get_scripts(driver)

    player_config = None
    for script in scripts:
      player_config = get_player_config_from_script(script)
      if player_config is not None:
        break
    
    if player_config is None:
      return jsonify({
        "status": "error",
        "message": "Could not find player configuration in the provided page",
      }), 500

    m3u8_url = get_meu8_url_using_player_config(player_config)
    if m3u8_url is None:
      return jsonify({
        "status": "error",
        "message": "Could not extract m3u8 URL from the provided page",
      }), 500

    return jsonify({
      "status": "success",
      "result": m3u8_url
    }), 200
  except Exception:
    return jsonify({
      "status": "error",
      "message": "An error occurred while processing the request"
    }), 500
  finally:
    if driver:
      driver.quit()