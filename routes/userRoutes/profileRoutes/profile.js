import express from "express";
import {
  profileHome,
  addFavSub,
  removeFavSub,
  getFavSub,
} from "../../../controllers/userControllers/profileControllers/profile.js";

const router = express.Router();

router.get("/:id", profileHome);
router.get("/get/fav-sub/:id", getFavSub);
router.post("/add/fav-sub/:id", addFavSub);
router.delete("/remove/fav-sub/:id", removeFavSub);
export default router;
