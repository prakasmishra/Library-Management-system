import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j'
import { formatDate } from "./utils/formatDate.js";

export const issueNotice = asyncHandler(async(req,res) => {
    
    const { heading,body} = req.body;

    const issue_date = formatDate(new Date());

    const query = `
        CREATE (n:Notice 
        {heading: $heading,
         body: $body,
         issue_date: $issue_date
        })
         RETURN n
    `;
    const result = await driver.executeQuery(query,{heading : heading,body : body, issue_date : issue_date});
    const parsedResult = parser.parse(result);

    if(parsedResult.length === 0){
        res.status(500);
        throw new Error("Failed to create notice");
    }
    res.send({message : 'Notice issued successfully'});
})