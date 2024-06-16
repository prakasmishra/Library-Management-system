import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

export const renewBook = asyncHandler(async(req,res) => {
    res.send("TODO :Book renewed successfully");
})