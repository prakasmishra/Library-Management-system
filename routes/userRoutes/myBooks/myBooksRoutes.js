import express from "express";
import {borrowingHistory,currentlyBorrowedBooks,wishlistedBooks} from "../../../controllers/userControllers/myBooksControllers/myBooksControllers.js";

const router=express.Router();

router.get('/current_books/memberId/:memberId',currentlyBorrowedBooks);
router.get('/history/memberId/:memberId',borrowingHistory); //range (query parameter)
router.get('/wishlist/memberId/:memberId',wishlistedBooks);

export default router; 