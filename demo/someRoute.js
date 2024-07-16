import express from "express";
import { someController } from "./someController.js";

const router = express.Router();

router.get("/", someController);

export default router;
