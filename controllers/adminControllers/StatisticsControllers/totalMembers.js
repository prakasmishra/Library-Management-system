import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

export const totalMembers = asyncHandler(async(req,res) => {
    const query = `
        MATCH (m:Member) 
        RETURN COUNT(m) AS totalMembers
    `;

    const result = await driver.executeQuery(query);
    const totalMembers = result.records[0].get("totalMembers").toInt();

    res.send({totalMembers});
})