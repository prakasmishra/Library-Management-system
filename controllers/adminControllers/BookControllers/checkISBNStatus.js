import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

import { checkBookExistence } from "./utils/checkBookExistence.js";

export const checkISBNStatus = asyncHandler(async(req,res)=>{
    const isbn_value = req.params.isbn_value;
    
    console.log("ISBN : ",isbn_value);

    const responseValue = await checkBookExistence(isbn_value);

    res.send({responseValue});
})