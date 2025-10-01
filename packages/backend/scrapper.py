from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException, TimeoutException, WebDriverException

def get_src_url(url, timeout = 10):
  driver = None
  try:
    driver = webdriver.Chrome()
    driver.implicitly_wait(timeout)
    driver.get(url)

    shadow_host = driver.find_element(By.CSS_SELECTOR, '.Clase-video > eit-player')
    shadow_root = shadow_host.shadow_root
    iframe = shadow_root.find_element(By.CSS_SELECTOR, 'iframe#video')

    driver.switch_to.frame(iframe)
    element = driver.find_element(By.CSS_SELECTOR, 'track')
    src = element.get_attribute('src')
    return {
      "status": "success",
      "result": src
    }
  except (NoSuchElementException, TimeoutException) as e:
    return {
      "status": "error",
      "message": f"Element not found or timed out: {e}"
    }
  except WebDriverException as e:
    return {
      "status": "error",
      "message": f"WebDriver issue: {e}"
    }
  except Exception as e:
    return {
      "status": "error",
      "message": f"Unexpected error occurred: {e}"
    }
  finally:
    if driver:
      driver.quit()
