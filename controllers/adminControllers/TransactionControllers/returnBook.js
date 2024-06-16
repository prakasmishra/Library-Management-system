import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j'
export const returnBook = asyncHandler(async(req,res) => {
    const transactionData = req.body;
    console.log("Isssue data ",transactionData);

   
    //  check if  issued , then proceed
    const query2 = `
        MATCH (:Member {membership_id : $membership_id})-
        [t:TRANSACTION {status : 'issued'}]->
        (:Book {isbn : $isbn})
        SET t.status = 'returned',
        t.return_date = $return_date
        RETURN t
    `;
    
    const result2 = await driver.executeQuery(query2,transactionData);
    const parsedResult2 = parser.parse(result2);

    console.log("Issued -> Returned : ",parsedResult2);

    // if not found , create new issue tx
    if(parsedResult2.length === 0){
        res.status(404).send("Book not issued previously");
        return;
    }    
    res.send("Book returned successfully");
})