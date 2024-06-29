import driver from "../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from "parse-neo4j";

export const getBookViaISBN = asyncHandler(async(req,res)=>{

    const isbn_value = req.params.isbn_value;

    const query = `
        MATCH (book:Book {isbn : $isbn}) ,
        (author:Author)-[:WROTE]->(book) ,
        (subject :Subject)-[:CONTAINS] -> (book)
        RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
    `;

    const result = await driver.executeQuery(query , {isbn : isbn_value});
    const resultArray = parser.parse(result);

    if(resultArray.length === 0){
        res.status(404);
        throw new Error("Book not found");
    }
    res.send(resultArray[0]);

})