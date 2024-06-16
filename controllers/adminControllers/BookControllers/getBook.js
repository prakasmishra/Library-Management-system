import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from "parse-neo4j";
import { getBookDetails } from "./utils/getBookDetails.js";

export const getBook = asyncHandler(async(req,res)=>{

    const isbn_value = req.params.isbn_value;
    
    console.log(isbn_value);

    const responseValue = await getBookDetails(isbn_value);

    res.send(responseValue);

})