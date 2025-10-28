import fs from "fs";
import path from "path";
import { generateGeminiResponse } from "../../infra/api/geminiClient.js";

export async function formatVTTContentService(text) {
  const promptPath = path.resolve(
    "src/config/prompts/formatVTTContentPrompt.txt"
  );
  const basePrompt = fs.readFileSync(promptPath, "utf8");

  const prompt = `
    ${basePrompt}

    ---
    ${text}
    ---
  `;

  const formatted = await generateGeminiResponse(prompt);
  return formatted;
}
