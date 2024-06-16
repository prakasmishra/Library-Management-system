import express from "express";
import {reserveBook ,wishlistBook} from "../../../controllers/userControllers/booksControllers/booksContollers.js";

const router=express.Router();

router.post('/reserve/isbn/:isbn/memberId/:memberId',reserveBook);
router.post('/wishlist/isbn/:isbn/memberId/:memberId',wishlistBook);

export default router; 
