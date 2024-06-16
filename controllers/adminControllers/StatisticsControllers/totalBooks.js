import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

export const totalBooks = asyncHandler(async(req,res) => {
    res.send("TODO : returned total book");
})