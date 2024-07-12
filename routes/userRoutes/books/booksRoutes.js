import express from "express";
import {
  reserveBook,
  addWishlistBook,
  recommendedBooks,
  relatedBooks,
  removeWishlistBook,
} from "../../../controllers/userControllers/booksControllers/booksContollers.js";

const router = express.Router();

router.get("/recommendation", recommendedBooks);
router.get("/related-books/isbn/:isbn",relatedBooks);
router.post('/reserve/isbn/:isbn/memberId/:memberId',reserveBook);
router.post('/add-wishlist/isbn/:isbn/memberId/:memberId',addWishlistBook);
router.post('/remove-wishlist/isbn/:isbn/memberId/:memberId',removeWishlistBook);
export default router;
