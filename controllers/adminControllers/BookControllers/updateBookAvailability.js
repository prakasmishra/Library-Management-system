import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from "parse-neo4j";
import { convertToNeo4jInteger } from "../../../utils/neo4j-driver.js";


export const updateBookAvailability = asyncHandler(async(req,res)=>{

    const {isbn,updatedCount } = req.body;

    const query = `
        MATCH (b:Book {isbn: $isbn})
        SET b.no_of_copies = $availability
        RETURN b
    `;

    const result = await driver.executeQuery(query,{isbn : isbn,availability : convertToNeo4jInteger(updatedCount)});
    const responseArray = parser.parse(result);

    if(responseArray.length === 0){
        res.status(404).json({message : "Book not found"});
        return;
    }
    res.send({response : "updated availability successfully"});
})