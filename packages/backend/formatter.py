import re
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