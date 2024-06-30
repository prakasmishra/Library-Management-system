import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j'
import { subtractDates } from "./utils/daysDiff.js";
import { compareDates } from "./utils/compareDate.js";
import { modifyLibCardString } from "./utils/modifyLibCardString.js";
import { formatDate } from "./utils/formatDate.js";
export const returnBook = asyncHandler(async(req,res) => {
    const transactionData = req.body;
    console.log("Isssue data ",transactionData);

    const  return_date = formatDate(new Date());
    transactionData.return_date = return_date;

   // find the due date

   const query1 = `
    MATCH (member:Member {membership_id : $membership_id})-
    [transaction:TRANSACTION {status : 'issued'}]->
    (:Book {isbn : $isbn})
    RETURN transaction,member
    `;
    
    
    const result1 = await driver.executeQuery(query1,transactionData);
    const parsedResult1 = parser.parse(result1);

    console.log(parsedResult1);
    // return;

    if(parsedResult1.length === 0 || parsedResult1[0].transaction === undefined){
        res.status(404);
        throw new Error("Book not issued previously");
    }    
    
    transactionData.due_date = parsedResult1[0].transaction.due_date;

    if(compareDates(transactionData.due_date,transactionData.return_date) !== -1){
        transactionData.fine = 0;
    }
    else{
        transactionData.fine = process.env.FINE_PER_DAY * ( subtractDates(
            transactionData.due_date,transactionData.return_date));
    }

    const lib_card_string = parsedResult1[0].member.library_card_string;
    const lib_card_no = parsedResult1[0].transaction.lib_card_no;

    console.log(lib_card_string);
    // change lib card status
    var new_lib_card_string = modifyLibCardString(lib_card_string,lib_card_no,"0");
    transactionData.new_lib_card_string = new_lib_card_string;

    console.log("lib card string (on return) : ",new_lib_card_string);
    // return;
    
    //  check if  issued , then proceed
    const query = `
    MATCH (m:Member {membership_id : $membership_id})-
    [t:TRANSACTION {status : 'issued'}]->
    (b:Book {isbn : $isbn})
    SET t.status = 'returned',
    t.return_date = $return_date,
    t.fine = $fine,
    b.no_of_copies = b.no_of_copies + 1,
     m.library_card_string = $new_lib_card_string
    RETURN t
    `;
    
    
    const result = await driver.executeQuery(query,transactionData);
    const parsedResult = parser.parse(result);
    

    console.log("Issued -> Returned : ",parsedResult);

    // if not found , create new issue tx
   
    res.send({fine : parsedResult[0].fine});
})