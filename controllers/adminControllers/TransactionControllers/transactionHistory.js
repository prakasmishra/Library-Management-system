import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

export const getHistory = asyncHandler(async(req,res) => {
    res.send("TODO :History returned successfully");
})