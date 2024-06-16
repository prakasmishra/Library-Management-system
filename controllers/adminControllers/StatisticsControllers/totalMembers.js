import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

export const totalMembers = asyncHandler(async(req,res) => {
    res.send("TODO : return total Members");
})