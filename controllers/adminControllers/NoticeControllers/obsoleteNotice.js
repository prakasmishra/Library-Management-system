import driver, { convertToNeo4jInteger } from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j';

export const obsoleteNotice = asyncHandler(async(req,res) => {

    const id = req.params.id;
    console.log(id);

    const query = `
        MATCH (n:Notice)
        WHERE id(n) = $id
        DELETE n
        RETURN TRUE
    `;
    const result = await driver.executeQuery(query,{ id : convertToNeo4jInteger(id)});
    const parsedResult = parser.parse(result); 

    
    if(parsedResult.length === 0){
        res.status(500);
        throw new Error("Failed to delete notice");
    }
    res.send({message : 'Notice Deleted successfully'});
})