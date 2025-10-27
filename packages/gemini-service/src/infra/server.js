import express from "express";
import cors from "cors";
import formatterRoutes from "../app/routes/formatterRoutes.js";
import { env } from "./config/env.js";

export function createServer() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      methods: ["POST", "GET"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(
    express.json({
      limit: `${env.MAX_MB}mb`,
    })
  );
  app.use(
    express.urlencoded({
      extended: true,
    })
  );

  app.use("/api", formatterRoutes);

  app.get("/", (req, res) => res.send("Gemini service API is running..."));

  app.use((err, req, res, next) => {
    console.error("Error no controlado", err);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  });

  return app;
}
