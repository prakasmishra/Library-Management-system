import express from "express";
import { profileHome } from "../../../controllers/userControllers/profileControllers/profile.js";

const router = express.Router();

router.get("/:id", profileHome);
export default router;
