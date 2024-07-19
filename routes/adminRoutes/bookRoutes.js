import express from "express";

import { addNewBook } from "../../controllers/adminControllers/BookControllers/addNewBook.js";
import { editBook } from "../../controllers/adminControllers/BookControllers/editBook.js";
import { deleteBook } from "../../controllers/adminControllers/BookControllers/deleteBook.js";
import { checkISBNStatus } from "../../controllers/adminControllers/BookControllers/checkISBNStatus.js";
import { getBook } from "../../controllers/adminControllers/BookControllers/getBook.js";
import { updateBookAvailability } from "../../controllers/adminControllers/BookControllers/updateBookAvailability.js";
import { notifyOnAvailable } from "../../middlewares/availabilityNotification.js";



const router = express.Router();

router.post("/book/add", addNewBook);
router.put("/book/edit", editBook);
router.delete("/book/delete/isbn/:isbn_value", deleteBook);

router.get("/book/checkisbn/:isbn_value", checkISBNStatus);
router.get("/book/isbn/:isbn_value", getBook);
router.put(
  "/book/update-availability",
  notifyOnAvailable,
  updateBookAvailability
);

export default router;
