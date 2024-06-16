import express from "express";
import { addUserDetails } from "../../../controllers/userControllers/authControllers/authContollers.js";
const router = express.Router();

router.put("/user-details/", addUserDetails);
// router.put("/fav-sub/:id", addFavouriteSubject);
export default router;
