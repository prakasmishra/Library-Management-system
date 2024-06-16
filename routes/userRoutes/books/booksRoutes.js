import express from "express";
import {
  reserveBook,
  wishlistBook,
  recommendedBooks,
} from "../../../controllers/userControllers/booksControllers/booksContollers.js";

const router = express.Router();

router.get("/recommendation", recommendedBooks);
router.post('/reserve/isbn/:isbn/memberId/:memberId',reserveBook);
router.post('/wishlist/isbn/:isbn/memberId/:memberId',wishlistBook);
export default router;
