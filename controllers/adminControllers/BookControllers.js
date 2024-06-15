import driver from "../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

export const addNewBook = asyncHandler(async(req,res) => {
    res.status(200).send({ message : "Added new book successfully"});
})

export const editBook = asyncHandler(async(req,res) => {
    res.status(200).send({ message : "Editted book successfully"});
})

export const deleteBook = asyncHandler(async(req,res) => {
    res.status(200).send({ message : "Deleted book successfully"});
})





