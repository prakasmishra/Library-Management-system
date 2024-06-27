import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j';
export const getAllActiveNotice = asyncHandler(async(req,res) => {
    
    const query = `
        MATCH (n:Notice {status : 'active'})
        RETURN n
    `;
    const result = await driver.executeQuery(query);
    const parsedResult = parser.parse(result);

    res.send(parsedResult);
})