import driver from "../../utils/neo4j-driver.js";
import asyncHandler from "express-async-handler";
import parser from 'parse-neo4j';

export const incrementPopularity = asyncHandler(async(req,res) => {
    const { isbn } = req.params;

    const query = `
            MATCH (book:Book {isbn : $isbn})
            WITH book, book.popularity + 1 AS newPopularity
            WHERE newPopularity <= apoc.math.maxInt()
            SET book.popularity = newPopularity
            RETURN TRUE
        `;

    const result = await driver.executeQuery(query , {isbn : isbn});
    const resultArray = parser.parse(result);

    if(resultArray.length === 0){
        res.status(404);
        throw new Error("Book not found");
    }
    res.send({message : "Popularity increased successfully"});

})

