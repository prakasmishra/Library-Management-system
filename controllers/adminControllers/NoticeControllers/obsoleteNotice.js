import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

export const obsoleteNotice = asyncHandler(async(req,res) => {
    res.send("TODO : Notice marked as obsoleted successfully")
})