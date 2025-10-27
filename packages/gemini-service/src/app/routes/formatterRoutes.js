import express from "express";
import { formatPlainTextController } from "../controllers/formatPlainTextController.js";

const routes = express.Router();

routes.post("/format-plain-text", formatPlainTextController);

export default routes;
