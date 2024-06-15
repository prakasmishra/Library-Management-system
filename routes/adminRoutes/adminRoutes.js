import express from 'express';

import  {addNewBook,editBook,deleteBook} from "../../controllers/adminControllers/BookControllers.js"

const router = express.Router();

router.post('/book/add',addNewBook);
router.put('/book/edit',editBook);
router.delete('/book/delete',deleteBook);

export default router;
