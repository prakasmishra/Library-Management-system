/*import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j'

export const renewBook = asyncHandler(async(req,res) => {
    res.send("TODO :Book renewed successfully");
})
*/
//to do made

import driver from "../../../utils/neo4j-driver.js"
import asyncHandler from "express-async-handler"
import { addDaysToDate } from "./utils/addDate.js";
import parser from 'parse-neo4j';

export const renewBook = asyncHandler(async (req, res) => {
    const { membership_id, isbn, renewal_date } = req.body;

    //check if the transaction exists and if the book is issued to the member
    const query1 = `
        MATCH (m:Member {membership_id: $membership_id})-
        [t:TRANSACTION {status: 'issued'}]->(b:Book {isbn: $isbn})
        RETURN t
    `;
    const result1 = await driver.executeQuery(query1, { membership_id, isbn });
    const parsedResult1 = parser.parse(result1);

    if (parsedResult1.length === 0) {
        res.status(400).send({ message: "No issued transaction found for this book and member." });
        return;
    }

    const transaction = parsedResult1[0];
    const renewal_count = transaction.properties.renewal_count.low; 

    if (renewal_count <= 0) {
        res.status(400).send({ message: "Renewal count is 0. Cannot renew this book." });
        return;
    }

    //calculating new due date
    const due_time_in_day = process.env.DUE_DAY_COUNT;
    const new_due_date = addDaysToDate(renewal_date, due_time_in_day);

    //update transaction to extend due date & decrement renewal count
    const query2 = `
        MATCH (m:Member {membership_id: $membership_id})-
        [t:TRANSACTION {status: 'issued'}]->(b:Book {isbn: $isbn})
        SET t.due_date = $new_due_date,
            t.renewal_count = t.renewal_count - 1
        RETURN t
    `;
    const result2 = await driver.executeQuery(query2, {
        membership_id,
        isbn,
        new_due_date
    });
    const parsedResult2 = parser.parse(result2);

    if (parsedResult2.length === 0) {
        res.status(500).send({ message: "Failed to renew the book." });
        return;
    }

    res.status(200).send({ message: "Book renewed successfully.", new_due_date });
});
