import driver, { convertToNeo4jInteger } from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j';
import { formatDate } from "./utils/formatDate.js";

export const obsoleteNotice = asyncHandler(async(req,res) => {

    const id = req.params.id;
    // console.log(id);

    // const date_of_demise = formatDate(new Date());
    // console.log(date_of_demise);
    // return;

    const query = `
        MATCH (n:Notice)
        WHERE id(n) = $id
        DELETE n
        RETURN TRUE
    `;
    const result = await driver.executeQuery(query,{ 
        id : convertToNeo4jInteger(id)
    });
    const parsedResult = parser.parse(result); 

    
    if(parsedResult.length === 0){
        res.status(500);
        throw new Error("Failed to delete notice");
    }

    res.send({message : 'Notice deleted successfully'});
})

