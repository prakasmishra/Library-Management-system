import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

export const totalBooks = asyncHandler(async(req,res) => {

    const query = `
        MATCH (b:Book) 
        RETURN COUNT(b) AS totalBooks
    `;

    const result = await driver.executeQuery(query);
    const totalBooks = result.records[0].get("totalBooks").toInt();

    res.send({totalBooks});
})