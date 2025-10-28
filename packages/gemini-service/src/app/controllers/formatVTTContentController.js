import { formatVTTContentService } from "../services/formatVTTContentService.js";

export async function formatVTTContentController(req, res) {
  try {
    const { vttContent } = req.body;

    if (!vttContent) {
      return res.status(400).json({
        status: "error",
        message: "El campo 'vttContent' es requerido",
      });
    }

    const formatted = await formatVTTContentService(vttContent);
    res.status(200).json({
      status: "success",
      result: formatted,
    });
  } catch (err) {
    console.error("Error en formatVTTContentController:", err.message);
    res.status(500).json({
      status: "error",
      message: "Error interno al procesar el texto",
    });
  }
}
