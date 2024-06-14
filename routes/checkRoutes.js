import express from "express";
import {check} from "../controllers/checkControllers.js";

const router=express.Router();

router.get('/check',check);

export default router; 
