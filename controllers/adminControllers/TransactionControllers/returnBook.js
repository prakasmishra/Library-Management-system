import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

export const returnBook = asyncHandler(async(req,res) => {
    res.send("TODO :Book returned successfully");
})