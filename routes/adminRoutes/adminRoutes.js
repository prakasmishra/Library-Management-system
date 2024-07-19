import express from "express";

import { addNewBook } from "../../controllers/adminControllers/BookControllers/addNewBook.js";
import { editBook } from "../../controllers/adminControllers/BookControllers/editBook.js";
import { deleteBook } from "../../controllers/adminControllers/BookControllers/deleteBook.js";
import { checkISBNStatus } from "../../controllers/adminControllers/BookControllers/checkISBNStatus.js";
import { updateBookAvailability } from "../../controllers/adminControllers/BookControllers/updateBookAvailability.js";
import { totalBooks } from "../../controllers/adminControllers/StatisticsControllers/totalBooks.js";
import { totalMembers } from "../../controllers/adminControllers/StatisticsControllers/totalMembers.js";
import { issueNotice } from "../../controllers/adminControllers/NoticeControllers/issueNotice.js";
import { obsoleteNotice } from "../../controllers/adminControllers/NoticeControllers/obsoleteNotice.js";
import { issueBook } from "../../controllers/adminControllers/TransactionControllers/issueBook.js";
import { returnBook } from "../../controllers/adminControllers/TransactionControllers/returnBook.js";
import { renewBook } from "../../controllers/adminControllers/TransactionControllers/renewBook.js";
import { getHistory } from "../../controllers/adminControllers/TransactionControllers/transactionHistory.js";
import { getAllActiveNotice } from "../../controllers/adminControllers/NoticeControllers/getAllActiveNotice.js";
import { setlibraryInfo } from "../../controllers/adminControllers/LibraryInfoControllers/setLibraryInfo.js";
import { getlibraryInfo } from "../../controllers/adminControllers/LibraryInfoControllers/getlibraryInfo.js";
import { issuedToday } from "../../controllers/adminControllers/StatisticsControllers/issuedToday.js";
import { returnedToday } from "../../controllers/adminControllers/StatisticsControllers/returnedToday.js";
import { borrowedThisMonth } from "../../controllers/adminControllers/StatisticsControllers/borrowedThisMonth.js";
import { totalOverdue } from "../../controllers/adminControllers/StatisticsControllers/totalOverdue.js";
import { sendNotificationEmail } from "../../controllers/adminControllers/NotificationControllers/notificationController.js";
import { notifyOnAvailable } from "../../middlewares/availabilityNotification.js";
import {
  getTask,
  getTaskCount,
  createTask,
  markAsRead,
} from "../../controllers/adminControllers/ETaskControllers/eTask.js";
import { createETask, deleteEtask, getEtask, getETaskCount } from "../../controllers/adminControllers/ETaskControllers/eTaskControllers.js";

const router = express.Router();

//notification routes
router.post("/notifications/send-notification", sendNotificationEmail);

// book routes
router.post("/book/add", addNewBook);
router.put("/book/edit", editBook);
router.delete("/book/delete/isbn/:isbn_value", deleteBook);
router.get("/book/checkisbn/:isbn_value", checkISBNStatus);
router.put(
  "/book/update-availability",
  notifyOnAvailable,
  updateBookAvailability
);

// transaction routes

router.put("/transaction/issue", issueBook);
router.put("/transaction/return", notifyOnAvailable, returnBook);
router.put("/transaction/renew", renewBook);
router.get("/transaction/history", getHistory);

// stats routes

router.get("/stats/total-books", totalBooks);
router.get("/stats/total-members", totalMembers);

router.get("/stats/total-issued-today", issuedToday);
router.get("/stats/total-returned-today", returnedToday);
router.get("/stats/total-borrowed-this-month", borrowedThisMonth);
router.get("/stats/total-overdue", totalOverdue);

// notice routes

router.put("/notice/issue", issueNotice);
router.get("/notice/get-all-active", getAllActiveNotice);
router.delete("/notice/mark-obsolete/noticeid/:id", obsoleteNotice);

// library info routes

router.put("/set-settings", setlibraryInfo);
router.get("/get-settings", getlibraryInfo);

// ETaks
// router.post("/add/e-task", createTask);
// router.get("/get/e-task", getTask);
// router.get("/get/e-taskCount", getTaskCount);
// router.put("/mark-as-read/e-task/:id", markAsRead);

// Etasks
router.post("/etask/create", createETask);
router.delete("/etask/delete/:id", deleteEtask);
router.get("/etask/get-all", getEtask);
router.get("/etask/get-count", getETaskCount);



export default router;
