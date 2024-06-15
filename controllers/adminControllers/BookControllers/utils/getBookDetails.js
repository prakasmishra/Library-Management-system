import driver from "../../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from "parse-neo4j";


export const getBookDetails = asyncHandler(async(isbn_value)=>{
    const query = `
        MATCH (b:Book {isbn : $isbn}) ,
        (author:Author)-[:WROTE]->(b) ,
        (subject :Subject)-[:CONTAINS] -> (b)
        RETURN b,author.author_name AS author_name,subject.sub_name AS sub_name
    `;

    const result = await driver.executeQuery(query , {isbn : isbn_value});
    const resultArray = parser.parse(result);

    return (resultArray.length !== 0) ? resultArray[0] : {message : 'Book  not found'};


})