import express from "express";
import {reserveBook ,wishlistBook} from "../../../controllers/userControllers/booksControllers/booksContollers.js";

const router=express.Router();

router.post('/reserve/:isbn',reserveBook);
router.post('/wishlist/:isbn',wishlistBook); //range (query parameter)

export default router; 
