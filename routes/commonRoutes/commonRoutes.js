import express from 'express';

import  {searchBooks} from "../../controllers/commonControllers/searchBooks.js"
import { getBookViaISBN } from '../../controllers/commonControllers/getBookViaISBN.js';
import { incrementPopularity } from '../../controllers/commonControllers/incrementPopularity.js';

const router = express.Router();

router.get('/book/search/input/:string_value',searchBooks);
router.get("/book/isbn/:isbn_value", getBookViaISBN);
router.post('/book/inc-popularity/isbn/:isbn',incrementPopularity);

export default router;
