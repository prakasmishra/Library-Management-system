import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import parser from 'parse-neo4j'
export const setlibraryInfo = asyncHandler(async(req,res) => {

    const info = req.body;
    console.log(info);



    const query = `
        MERGE (l:LibraryINFO)
        SET l = {library_name: $library_name,
         address: $address,
         contact_info: $contact_info,
         opening_hours_sunday : $opening_hours_sunday,
         opening_hours_otherday : $opening_hours_otherday,
         library_email : $library_email
g        }
         RETURN l
    `;
    const result = await driver.executeQuery(query,info);
    const parsedResult = parser.parse(result);

    if(parsedResult.length === 0){
        res.status(500);
        throw new Error("Failed to set Library info.");
    }
    res.send({message : 'Libray info set successfully'});


    // res.send("TODO : set Library Info");
})