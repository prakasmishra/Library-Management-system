import driver from "../../utils/neo4j-driver.js"
import asyncHandler from 'express-async-handler';
import parser from 'parse-neo4j';

export const searchBooks = asyncHandler(async(req, res) => {


    // extracting path vars and query params
    const stringValue = req.params.string_value.replace(/\+/g, '%20');
    const decodedStringValue = decodeURIComponent(stringValue);
    const inputStringTerms = decodedStringValue.split(/\s(?<!")/);

    const {availability,sortby} = req.query;

    console.log(`availability = ${availability} , ${typeof availability} `);

    // sortby=0(edition)/1(publication-date)/2(popularity)
    console.log(`sortby = ${sortby}`);
    
    console.log(`String-value-terms = ${inputStringTerms}`);
    

    // querying the db



    const result = await driver.executeQuery(
        'MATCH (book : Book) RETURN book LIMIT 2 ;',
        {}
    ) .then(parser.parse)
    .then((parsed) => {


        
        // parsed.forEach((parsedRecord) => {
        //     console.log(parsedRecord);
        // });
    })
    .catch((parseError) => {
        console.log(`Parsing error ${parseError}`);
    });

    console.log('>> Results')
    // for(var record of result.records) {
    // console.log(record.get('book'));
    // }

    const responseArray = Promise.all(result.records.map((bookObj) => {
        const book = bookObj.get('book');
        console.log(book);
        return JSON.stringify(book);
    }))



    res.status(200).send(JSON.stringify(result));
})
