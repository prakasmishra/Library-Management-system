import express from 'express';

import  {searchBooks} from "../../controllers/commonControllers/searchBooks.js"

const router = express.Router();

router.get('/book/search/input/:string_value',searchBooks);

export default router;
