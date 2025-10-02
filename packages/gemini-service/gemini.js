import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function formatTranscript(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  try {
    const prompt = `
      Eres un asistente experto en organización de transcripciones de video.
      Tu única tarea es devolver el contenido procesado, nunca expliques ni añadas comentarios.

      Instrucciones:
      1. Lee el siguiente texto:
      ---
      ${text}
      ---
      2. Reestructura la transcripción de forma clara, siguiendo este formato:
        - Un *título principal* que resuma el contenido del video.
        - División en *temas principales*.
          - Indica el momento de inicio y de finalización de cada tema o subtema.
          - Especifica bien cada tema para su comprensión y análisis.
        - Usa *subtítulos* para cada tema o subtema.
        - Redacta en *párrafos claros y coherentes*, sin perder información importante.

      3. Al final, genera un bloque llamado:
        **Listado de sub-videos por temas**
        - Este bloque debe contener ÚNICAMENTE un listado en formato:
          - Tema X: inicio -> fin
        - No incluyas explicaciones ni descripciones, solo los tiempos.
        - Ejemplo:
          - Tema 1: 00:00:00 -> 00:35:20
          - Tema 2: 00:35:21 -> 01:20:10
          - Tema 3: 01:20:11 -> 02:00:00
  
`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Falló el procesamiento:", err.message);
    throw err;
  }
}