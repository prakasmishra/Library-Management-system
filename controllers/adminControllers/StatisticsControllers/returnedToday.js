import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j'

export const returnedToday = asyncHandler(async(req,res)=>{
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
  
    const today = `${day}-${month}-${year}`;
    console.log(today);

    const query = `
        MATCH (:Member)-[:TRANSACTION {return_date : $return_date} ]->(b:Book) 
        RETURN COUNT(b) AS totalBooks
    `;

    const result = await driver.executeQuery(query,{return_date : today});
    const totalBooks = result.records[0].get("totalBooks").toInt();

    res.send({totalBooks});
})