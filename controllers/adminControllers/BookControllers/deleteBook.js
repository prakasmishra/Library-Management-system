import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from "parse-neo4j";
 

export const deleteBook = asyncHandler(async(req,res) => {

    const isbn_value = req.params.isbn_value;
    
    const query = `
        MATCH (b:Book {isbn : $isbn}) 
        DETACH DELETE b
        RETURN TRUE
    `;

    const result = await driver.executeQuery(query , {isbn : isbn_value});
    const resultArray = parser.parse(result);

    if(resultArray.length !== 0){
        res.status(200).send({ message : "Book deleted successfully"});
    }
    else{
        res.status(400).send({ message : "Book doesn't exists."});
    }

})

