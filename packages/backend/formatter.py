import re
import requests;
def formatter(text):      
    patterns = [
    r"WEBVTT\n{1}",
    r"\d+\n\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3}",
    r"\n{3}"
    ]

    temp_text = re.sub(patterns[0], "", text)
    temp_text = re.sub(patterns[1], "", temp_text)
    temp_text = re.sub(patterns[2], " ", temp_text)
    return temp_text.strip()

def get_text_formatted(text):
    response = requests.post(
        "http://localhost:4000/format",
        json={"text": text}
    )
    response.raise_for_status()
    data = response.json()
    return data.get("data")