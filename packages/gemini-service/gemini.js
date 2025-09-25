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
      - Un **título principal** que resuma el contenido del video.
      - División en **temas principales**. 
        - Si hay marcas de tiempo, indícalas y señala el momento de culminación de cada tema o subtema.
        - Especifica bien cada tema para su comprensión y analisis
      - Usa **subtítulos** para cada tema o subtema.
      - Redacta en **párrafos claros y coherentes**, sin perder información importante.

      Entrega SOLO el esquema final limpio, sin explicaciones adicionales.
      `;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Falló el procesamiento:", err.message);
    throw err;
  }
}
