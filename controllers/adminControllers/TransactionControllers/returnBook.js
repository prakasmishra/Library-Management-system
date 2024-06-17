import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j'
import { subtractDates } from "./utils/daysDiff.js";
export const returnBook = asyncHandler(async(req,res) => {
    const transactionData = req.body;
    console.log("Isssue data ",transactionData);

   
    const fine = process.env.FINE_PER_DAY * ( subtractDates(
        transactionData.return_date,transactionData.issue_date));
    
    console.log(fine);


    //  check if  issued , then proceed
    const query = `
        MATCH (:Member {membership_id : $membership_id})-
        [t:TRANSACTION {status : 'issued'}]->
        (b:Book {isbn : $isbn})
        SET t.status = 'returned',
        t.return_date = $return_date,
        t.fine = $fine,
        b.no_of_copies = b.no_of_copies + 1
        RETURN t
    `;

    transactionData.fine = fine;
    
    const result = await driver.executeQuery(query,transactionData);
    const parsedResult = parser.parse(result);

    console.log("Issued -> Returned : ",parsedResult);

    // if not found , create new issue tx
    if(parsedResult.length === 0){
        res.status(404);
        throw new Error("Book not issued previously");
    }    
    res.send(parsedResult[0]);
})