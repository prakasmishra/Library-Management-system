import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j'

export const borrowedThisMonth = asyncHandler(async(req,res)=>{
    const date = new Date();
    const day = "01";
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
  
    const firstDayofThisMonth = `${year}-${month}-${day}`;
    console.log(firstDayofThisMonth);

    const query = `
        MATCH (:Member)-[r:TRANSACTION {status : 'issued'}]->(b:Book) 
        WHERE date(datetime({year: toInteger(split(r.issue_date, '-')[2]), 
        month: toInteger(split(r.issue_date, '-')[1]), 
        day: toInteger(split(r.issue_date, '-')[0])})) < date($firstDayofThisMonth)
        RETURN COUNT(b) AS totalBooks
    `;

    const result = await driver.executeQuery(query,{firstDayofThisMonth});
    const totalBooks = result.records[0].get("totalBooks").toInt();

    res.send({totalBooks});
})