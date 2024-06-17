import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j'

export const issueNotice = asyncHandler(async(req,res) => {
    
    const { heading,body,date } = req.body;

    const query = `
        CREATE (n:Notice 
        {heading: $heading,
         body: $body,
         date: $date
        })
         RETURN n
    `;
    const result = await driver.executeQuery(query,{heading : heading,body : body, date : date});
    const parsedResult = parser.parse(result);

    if(parsedResult.length === 0){
        res.status(500);
        throw new Error("Failed to create notice");
    }
    res.send({message : 'Notice created successfully'});
})