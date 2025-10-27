import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: process.env.PORT || 4000,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,

  MAX_MB: process.env.MAX_MB || "50",
};

if (!env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY no está definida en .env");
  process.exit(1);
}
