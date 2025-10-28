import express from "express";
import { formatPlainTextController } from "../controllers/formatPlainTextController.js";
import { formatVTTContentController } from "../controllers/formatVTTContentController.js";

const routes = express.Router();

routes.post("/format-plain-text", formatPlainTextController);
routes.post("/format-vtt-content", formatVTTContentController);

export default routes;
