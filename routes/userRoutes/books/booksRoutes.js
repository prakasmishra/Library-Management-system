import express from "express";
import {
  reserveBook,
  addWishlistBook,
  recommendedBooks,
  relatedBooks,
  removeWishlistBook,
  requestRenewBook,
} from "../../../controllers/userControllers/booksControllers/booksContollers.js";

const router = express.Router();

router.get("/recommendation", recommendedBooks);
router.get("/related-books/isbn/:isbn",relatedBooks);
router.post('/reserve/isbn/:isbn/memberId/:memberId',reserveBook);
router.post('/add-wishlist/isbn/:isbn/memberId/:memberId',addWishlistBook);
router.post('/remove-wishlist/isbn/:isbn/memberId/:memberId',removeWishlistBook);
router.post('/request-renew/isbn/:isbn/memberId/:memberId',requestRenewBook);

export default router;
