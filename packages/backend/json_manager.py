import json
import os

def read_json(file_path: str):
  if not os.path.exists(file_path):
    return None
  try:
    with open(file_path, "r", encoding="utf-8") as f:
      return json.load(f)
  except Exception as e:
    print(e)
    return None

def write_json(file_path: str, data):
  try:
    with open(file_path, "w", encoding="utf-8") as f:
      json.dump(data, f, ensure_ascii=False, indent=2)
    return True
  except Exception as e:
    print(e)
    return False