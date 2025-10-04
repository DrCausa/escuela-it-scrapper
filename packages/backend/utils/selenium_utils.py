from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.remote.webdriver import WebDriver, WebElement, ShadowRoot


def get_chrome_driver() -> WebDriver:
  options = webdriver.ChromeOptions()
  options.add_argument(r"--user-data-dir=C:\selenium-profile")
  options.add_argument("--profile-directory=Default")
  options.add_argument("--restore-last-session=false")
  options.add_argument("--no-first-run")
  return webdriver.Chrome(options=options)


def get_iframe_video(driver: WebDriver) -> WebElement | None:
  try:
    shadow_host: WebElement = driver.find_element(By.CSS_SELECTOR, '.Clase-video > eit-player')
    shadow_root: ShadowRoot = shadow_host.shadow_root
    return shadow_root.find_element(By.CSS_SELECTOR, 'iframe#video')
  except NoSuchElementException:
    return None


def get_track_src(driver: WebDriver) -> str | None:
  try:
    element: WebElement = driver.find_element(By.CSS_SELECTOR, 'track')
    return element.get_attribute('src')
  except NoSuchElementException:
    return None