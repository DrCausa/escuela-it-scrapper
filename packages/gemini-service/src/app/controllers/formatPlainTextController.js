import { formatPlainTextService } from "../services/formatPlainTextService.js";

export async function formatPlainTextController(req, res) {
  try {
    const { plainText } = req.body;

    if (!plainText) {
      return res.status(400).json({
        status: "error",
        message: "El campo 'plainText' es requerido",
      });
    }

    const formatted = await formatPlainTextService(plainText);
    res.status(200).json({
      status: "success",
      result: formatted,
    });
  } catch (err) {
    console.error("Error en formatPlainTextController:", err.message);
    res.status(500).json({
      status: "error",
      message: "Error interno al procesar el texto",
    });
  }
}
