import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

export const issueNotice = asyncHandler(async(req,res) => {
    res.send("TODO : Issued notice successfully")
})