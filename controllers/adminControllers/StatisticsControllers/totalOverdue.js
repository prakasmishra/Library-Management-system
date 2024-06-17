import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j'

export const totalOverdue = asyncHandler(async(req,res)=>{
      
        const query = `
            MATCH (:Member)-[r:TRANSACTION {status : 'issued'}]->(b:Book) 
            RETURN COUNT(b) AS totalBooks
        `;
    
        const result = await driver.executeQuery(query);
        const totalBooks = result.records[0].get("totalBooks").toInt();
    
        res.send({totalBooks});
})