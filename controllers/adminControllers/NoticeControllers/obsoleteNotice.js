import driver, { convertToNeo4jInteger } from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j';

export const obsoleteNotice = asyncHandler(async(req,res) => {

    const id = req.params.id;
    // console.log(id);

    const date_of_demise = formatDate(new Date());
    // console.log(date_of_demise);
    // return;

    const query = `
        MATCH (n:Notice)
        WHERE id(n) = $id
        SET n.status = 'inactive',
        n.date_of_demise = $date_of_demise
    `;
    const result = await driver.executeQuery(query,{ 
        id : convertToNeo4jInteger(id),
        date_of_demise : date_of_demise
    });
    const parsedResult = parser.parse(result); 

    
    if(parsedResult.length === 0){
        res.status(500);
        throw new Error("Failed to delete notice");
    }
    parsedResult[0].message = 'Notice marked as inactive successfully';
    res.send(parsedResult[0]);
})

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
  
    return `${day}-${month}-${year}`;
  }