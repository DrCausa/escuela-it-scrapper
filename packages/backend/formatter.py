from cgitb import text
import re
from urllib import response
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

def get_TextFormatted(text):
    response = requests.post(
        "http://localhost:4000/format",
        json={"text": text}
    )
    response.raise_for_status()
    data = response.json()  # 🔥 extraer JSON
    print("Respuesta de gemini-service:", data)
    return data.get("data")  # nos interesa SOLO el texto formateado






#FORMATO SRT
def vtt_to_srt(vtt_text: str) -> str:
    """
    Convierte contenido WebVTT a formato SRT básico.
    - Elimina cabecera WEBVTT
    - Reemplaza milisegundos con coma
    - Genera índices secuenciales por bloque
    """
    # Normalizar saltos de línea
    text = vtt_text.replace("\r\n", "\n").replace("\r", "\n")
    # Eliminar cabecera WEBVTT
    text = re.sub(r"^\s*WEBVTT.*\n+", "", text)

    # Separar por bloques
    blocks = re.split(r"\n\n+", text.strip())
    srt_lines = []
    index = 1

    time_pattern = re.compile(r"(?P<start>\d{2}:\d{2}:\d{2}\.\d{3})\s*-->\s*(?P<end>\d{2}:\d{2}:\d{2}\.\d{3})")

    for block in blocks:
        # Saltar notas u otros metadatos
        if block.strip().lower().startswith(("note", "style", "region")):
            continue

        lines = [l for l in block.split("\n") if l.strip() != ""]
        if not lines:
            continue

        # Buscar línea de tiempo
        time_line_idx = -1
        for i, line in enumerate(lines):
            if time_pattern.search(line):
                time_line_idx = i
                break

        if time_line_idx == -1:
            # Bloque sin tiempo: ignorar
            continue

        # Construir bloque SRT
        srt_lines.append(str(index))

        m = time_pattern.search(lines[time_line_idx])
        start = m.group("start").replace(".", ",")
        end = m.group("end").replace(".", ",")
        srt_lines.append(f"{start} --> {end}")

        # El resto de líneas tras la de tiempo son el texto
        text_lines = lines[time_line_idx + 1 :]
        # Eliminar etiquetas HTML o VTT simples
        clean_text_lines = [re.sub(r"<[^>]+>", "", t) for t in text_lines]
        if not clean_text_lines:
            clean_text_lines = [""]
        srt_lines.extend(clean_text_lines)
        srt_lines.append("")
        index += 1




    return "\n".join(srt_lines).strip() + "\n"