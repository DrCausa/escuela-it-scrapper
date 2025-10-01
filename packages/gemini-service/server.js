import express from "express";
import { formatTranscript } from "./gemini.js";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.post("/format", async (req, res) => {
  try {
    // **IMPORTANTE:** Usa 'await' para esperar a que la promesa se resuelva
    const { text } = req.body;
    const formatted = await formatTranscript(text);
    res.json({ data: formatted, status: "200" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Error processing transcript", status: "500" });
  }
});

app.listen(4000, () => {
  console.log("Gemini service running on port 4000");
});
