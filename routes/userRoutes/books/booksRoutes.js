import express from "express";
import {
  reserveBook,
  wishlistBook,
  recommendedBooks,
} from "../../../controllers/userControllers/booksControllers/booksContollers.js";

const router = express.Router();

router.post("/reserve/:isbn/:memberId", reserveBook);
router.post("/wishlist/:isbn/:memberId", wishlistBook);
router.get("/recommendation", recommendedBooks);

export default router;
