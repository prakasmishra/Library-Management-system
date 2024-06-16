import express from 'express';

import { addNewBook } from '../../controllers/adminControllers/BookControllers/addNewBook.js';
import { editBook } from '../../controllers/adminControllers/BookControllers/editBook.js';
import { deleteBook } from '../../controllers/adminControllers/BookControllers/deleteBook.js';
import { checkISBNStatus } from '../../controllers/adminControllers/BookControllers/checkISBNStatus.js';
import { getBook } from '../../controllers/adminControllers/BookControllers/getBook.js';
import { updateBookAvailability } from '../../controllers/adminControllers/BookControllers/updateBookAvailability.js';
import { totalBooks } from '../../controllers/adminControllers/StatisticsControllers/totalBooks.js';
import { totalMembers } from '../../controllers/adminControllers/StatisticsControllers/totalMembers.js';
import { issueNotice } from '../../controllers/adminControllers/NoticeControllers/issueNotice.js';
import { obsoleteNotice } from '../../controllers/adminControllers/NoticeControllers/obsoleteNotice.js';
import { libraryInfo } from '../../controllers/adminControllers/LibraryInfoControllers/libraryInfo.js';
import { issueBook } from '../../controllers/adminControllers/TransactionControllers/issueBook.js';
import { returnBook } from '../../controllers/adminControllers/TransactionControllers/returnBook.js';
import { renewBook } from '../../controllers/adminControllers/TransactionControllers/renewBook.js';
import { getHistory } from '../../controllers/adminControllers/TransactionControllers/transactionHistory.js';


const router = express.Router();


// book routes
router.post('/book/add',addNewBook);
router.put('/book/edit',editBook);
router.delete('/book/delete/isbn/:isbn_value',deleteBook);
router.get('/book/checkisbn/:isbn_value',checkISBNStatus);
router.get('/book/isbn/:isbn_value',getBook);
router.put('/book/update-availability',updateBookAvailability);


// transaction routes

router.put('/transaction/issue',issueBook);
router.put('/transaction/return',returnBook);
router.put('/transaction/renew',renewBook);
router.get('/transaction/history',getHistory);

// stats routes

router.get('/stats/total-books',totalBooks);
router.get('/stats/total-members',totalMembers);

// notice routes

router.put('/notice/issue',issueNotice);
router.put('/notice/mark-obsolete',obsoleteNotice);

// library info routes

router.put('/settings',libraryInfo);

export default router;
