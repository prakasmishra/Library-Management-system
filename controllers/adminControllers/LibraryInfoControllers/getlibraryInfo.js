import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j'
export const getlibraryInfo = asyncHandler(async(req,res) => {

    const query = `
        MATCH (l:LibraryINFO)
         RETURN l
    `;
    const result = await driver.executeQuery(query);
    const parsedResult = parser.parse(result);

    if(parsedResult.length === 0){
        res.status(500);
        throw new Error("Failed to get Library info.");
    }
    res.send(parsedResult[0]);


    // res.send("TODO : set Library Info");
})