import express from "express";
import {
  profileHome,
  addFavSub,
  removeFavSub,
  getFavSub,
  getLibraryCardInfo,
} from "../../../controllers/userControllers/profileControllers/profile.js";

const router = express.Router();

router.get("/:id", profileHome);
router.get("/get/fav-sub/:id", getFavSub);
router.put("/update/fav-sub/:id", addFavSub);
router.delete("/remove/fav-sub/:id", removeFavSub);
router.get("/get/library-card-details/:id", getLibraryCardInfo);

export default router;
