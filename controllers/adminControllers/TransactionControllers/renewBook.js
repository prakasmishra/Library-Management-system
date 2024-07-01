import driver, { convertToNeo4jInteger } from "../../../utils/neo4j-driver.js";
import asyncHandler from "express-async-handler";
import { addDaysToDate } from "./utils/addDate.js";
import parser from 'parse-neo4j';
import moment from 'moment';

export const renewBook = asyncHandler(async (req, res) => {
    const transactionData = req.body;

    

    
    const query1 = `
        MATCH (:Member {membership_id : $membership_id})-
        [t:TRANSACTION {status : 'issued'}]->
        (:Book {isbn : $isbn})
        RETURN t, t.issue_date AS issue_date, t.renewal_count AS renewal_count
    `;
    const result1 = await driver.executeQuery(query1, transactionData);
    const parsedResult1 = parser.parse(result1);

    if (parsedResult1.length === 0) {
        return res.status(400).send("Book not issued yet");
    }

    const transaction = parsedResult1[0].t;
    const renewal_count = transaction.renewal_count;
    const issueDate = transaction.issue_date;

    if (renewal_count <= 0) {
        return res.status(400).send({ message: "Renewal count is 0. Cannot renew this book." });
    }

    
    const validIssueDate = moment(issueDate, 'DD-MM-YYYY', true);
    if (!validIssueDate.isValid()) {
        return res.status(400).send("Invalid issue date format in the transaction.");
    }

    
    const due_time_in_days = parseInt(process.env.DUE_DAY_COUNT, 10);
    const new_due_date = addDaysToDate(validIssueDate.format('DD-MM-YYYY'), due_time_in_days);

    
    transactionData.due_date = new_due_date;
    transactionData.renewal_count = convertToNeo4jInteger(renewal_count - 1);

    
    const query2 = `
        MATCH (:Member {membership_id : $membership_id})-
        [t:TRANSACTION {status : 'issued'}]->
        (:Book {isbn : $isbn})
        SET t.due_date = $due_date,
            t.renewal_count = $renewal_count
        RETURN t
    `;

    const result2 = await driver.executeQuery(query2, transactionData);
    const parsedResult2 = parser.parse(result2);

    res.status(200).send({ message: "Book renewed successfully.", due_date: new_due_date });
});
