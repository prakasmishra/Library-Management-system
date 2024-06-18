import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j'
import { subtractDates } from "./utils/daysDiff.js";
import { compareDates } from "./utils/compareDate.js";
export const returnBook = asyncHandler(async(req,res) => {
    const transactionData = req.body;
    console.log("Isssue data ",transactionData);

   // find the due date

   const query1 = `
    MATCH (:Member {membership_id : $membership_id})-
    [t:TRANSACTION {status : 'issued'}]->
    (:Book {isbn : $isbn})
    RETURN t
    `;
    
    
    const result1 = await driver.executeQuery(query1,transactionData);
    const parsedResult1 = parser.parse(result1);

    if(parsedResult1.length === 0){
        res.status(404);
        throw new Error("Book not issued previously");
    }    
    
    transactionData.due_date = parsedResult1[0].due_date;

    if(compareDates(transactionData.due_date,transactionData.return_date) !== -1){
        transactionData.fine = 0;
    }
    else{
        transactionData.fine = process.env.FINE_PER_DAY * ( subtractDates(
            transactionData.due_date,transactionData.return_date));
    }

    
    
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
    
    
    const result = await driver.executeQuery(query,transactionData);
    const parsedResult = parser.parse(result);
    

    console.log("Issued -> Returned : ",parsedResult);

    // if not found , create new issue tx
   
    res.send(parsedResult[0]);
})