import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

export const libraryInfo = asyncHandler(async(req,res) => {
    res.send("TODO : return Library Info");
})