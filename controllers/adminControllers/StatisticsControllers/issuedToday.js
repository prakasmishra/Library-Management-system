import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

export const issuedToday = asyncHandler(async(req,res) => {
    res.send("TODO :Issued Today sent successfully");
})