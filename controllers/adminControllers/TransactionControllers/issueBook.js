import driver, { convertToNeo4jInteger } from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import { addDaysToDate } from "./utils/addDate.js";
import parser from 'parse-neo4j';

// change lib card status

export const issueBook = asyncHandler(async(req,res) => {
    
    const transactionData = req.body;
    
    // calculate due_date
    console.log(transactionData.issue_date);
    if(transactionData.issue_date === undefined){
        res.status(400).send("Incomplete data");
    }

    const due_time_in_day = process.env.DUE_DAY_COUNT;
    const due_date = addDaysToDate(transactionData.issue_date,due_time_in_day);
    transactionData.due_date = due_date;

    // add renewal count
    transactionData.renewal_count = convertToNeo4jInteger(process.env.MAX_RENEWAL_COUNT);

    console.log("Isssue data ",transactionData);

    // check for book 

    const bookExists = parser.parse( await driver.executeQuery(
        `MATCH (b:Book {isbn : $isbn}) RETURN b`,
        {isbn : transactionData.isbn}
    ));

    if(bookExists.length === 0){
        res.status(400);
        throw new Error("Book does not exist.");
    }
    else if(bookExists[0].no_of_copies <= 0){
        res.status(400);
        throw new Error("Cannot issue book, not available.");
    }

    // check for member
    const memberExists = parser.parse( await driver.executeQuery(
        `MATCH (m:Member {membership_id : $membership_id}) RETURN m`,
        {membership_id : transactionData.membership_id}
    ));

    if(!memberExists){
        res.status(400);
        throw new Error("member does not exist.");
    }

    //  check if already issued or not
    const query1 = `
        MATCH (:Member {membership_id : $membership_id})-
        [t:TRANSACTION {status : 'issued'}]->
        (:Book {isbn : $isbn})
        RETURN t
    `;
    const result1 = await driver.executeQuery(query1,transactionData);
    const parsedResult1 = parser.parse(result1);

    if(parsedResult1.length !== 0){
        res.status(400);
        throw new Error("Book already issued");
    }
    // find booked tx , update status and dates
    // also update book avaialbility

    const query2 = `
        MATCH (:Member {membership_id : $membership_id})-
        [t:TRANSACTION {status : 'booked'}]->
        (b:Book {isbn : $isbn})
        SET t.status = 'issued',
        t.issue_date = $issue_date,
        t.due_date = $due_date,
        t.copy_no = $copy_no,
        t.lib_card_no = $lib_card_no,
        t.renewal_count = $renewal_count,
        b.no_of_copies = b.no_of_copies-1
        RETURN t
    `;
    
    const result2 = await driver.executeQuery(query2,transactionData);
    const parsedResult2 = parser.parse(result2);

    console.log("Booked -> Issued",parsedResult2);

    // if not found , create new issue tx
    if(parsedResult2.length === 0){

        console.log("No booked tx found , creating new issue tx...");
        
        const query3 = `
        MATCH (m:Member {membership_id : $membership_id}),
        (b:Book {isbn : $isbn})
        CREATE (m)-[t:TRANSACTION {
            status : 'issued',
            issue_date : $issue_date,
            due_date : $due_date,
            copy_no : $copy_no,
            lib_card_no : $lib_card_no,
            renewal_count : $renewal_count
         }]->(b)
        WITH b,t
        SET b.no_of_copies = b.no_of_copies-1
        RETURN t
        `;

        const result3 = await driver.executeQuery(query3,transactionData);
        const parsedResult3 = parser.parse(result3);
        
        if(parsedResult3.length === 0){
            res.status(500);
            throw new Error("Failed to create new issue tx");
        }

        res.status(200).send({message : "Book issued successfully(Not booked,directly issued)"});
        return;
    }   
    res.send({message : "Book issued successfully(formaly booked,not issued)"});
})

