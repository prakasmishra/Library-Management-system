import express from "express";
import {
  reserveBook,
  addWishlistBook,
  recommendedBooks,
  relatedBooks,
  removeWishlistBook,
  requestRenewBook,
} from "../../../controllers/userControllers/booksControllers/booksContollers.js";
import { checkStatusActive } from "../../../controllers/userControllers/authMiddleware/authMiddleware.js";

const router = express.Router();

router.get("/recommendation", recommendedBooks);
router.get("/related-books/isbn/:isbn",relatedBooks);
router.post('/reserve/isbn/:isbn/memberId/:memberId',checkStatusActive,reserveBook);
router.post('/add-wishlist/isbn/:isbn/memberId/:memberId',checkStatusActive,addWishlistBook);
router.post('/remove-wishlist/isbn/:isbn/memberId/:memberId',checkStatusActive,removeWishlistBook);
router.post('/request-renew/isbn/:isbn/memberId/:memberId',checkStatusActive,requestRenewBook);

export default router;
