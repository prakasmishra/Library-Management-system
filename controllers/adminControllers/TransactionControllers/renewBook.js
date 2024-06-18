
import driver, { convertToNeo4jInteger } from "../../../utils/neo4j-driver.js"
import asyncHandler from "express-async-handler"
import { addDaysToDate } from "./utils/addDate.js";
import parser from 'parse-neo4j';



export const renewBook = asyncHandler(async (req, res) => {
    const transactionData = req.body;

    

    // calculate due_date
    console.log(transactionData.issue_date);
    if(transactionData.issue_date=== undefined){

        res.status(400).send("Renewal count object not found");

    }

    

    const due_time_in_days = process.env.RENEWAL_EXTENDED_DAY_COUNT;
    const due_date = addDaysToDate(transactionData.issue_date,due_time_in_days);
    transactionData.due_date = due_date;
   

    //check if the transaction exists and if the book is issued to the member
    //  check if already issued or not
    const query1 = `
        MATCH (:Member {membership_id : $membership_id})-
        [t:TRANSACTION {status : 'issued'}]->
        (:Book {isbn : $isbn})
        RETURN t
    `;
    const result1 = await driver.executeQuery(query1,transactionData);
    const parsedResult1 = parser.parse(result1);

    if(parsedResult1.length === 0){
        res.status(400);
        throw new Error("Book not issued yet");
    }

    const transaction = parsedResult1[0];
    console.log(transaction);

    const renewal_count = transaction.renewal_count; 
    transactionData.renewal_count=convertToNeo4jInteger(renewal_count);

    if (renewal_count <= 0) {
        res.status(400).send({ message: "Renewal count is 0. Cannot renew this book." });
        return;
    }
//t.renewal_count = t.renewal_count - 1


const query2 = `
MATCH (:Member {membership_id : $membership_id})-
[t:TRANSACTION {status : 'issued'}]->
(:Book {isbn : $isbn})
SET t.status = 'issued',
t.issue_date = $issue_date,
t.due_date = $due_date,
t.copy_no = $copy_no,
t.lib_card_no = $lib_card_no,
t.renewal_count = $renewal_count-1
RETURN t
`;

const result2 = await driver.executeQuery(query2,transactionData);
const parsedResult2 = parser.parse(result2);

console.log("Book is renewed",parsedResult2);
    res.status(200).send({ message: "Book renewed successfully.", due_date });
});
