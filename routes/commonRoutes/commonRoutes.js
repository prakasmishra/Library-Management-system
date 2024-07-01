import express from 'express';

import  {searchBooks} from "../../controllers/commonControllers/searchBooks.js"
import { getBookViaISBN } from '../../controllers/commonControllers/getBookViaISBN.js';

const router = express.Router();

router.get('/book/search/input/:string_value',searchBooks);
router.get("/book/isbn/:isbn_value", getBookViaISBN);

export default router;
