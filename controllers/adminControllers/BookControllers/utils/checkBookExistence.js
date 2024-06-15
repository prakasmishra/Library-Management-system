import driver from "../../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from "parse-neo4j";


export const checkBookExistence = asyncHandler(async(isbn_value)=>{
    const query = `
        MATCH (b:Book {isbn : $isbn}) 
        RETURN TRUE
    `;

    const result = await driver.executeQuery(query , {isbn : isbn_value});
    const resultArray = parser.parse(result);

    return (resultArray.length !== 0);
})