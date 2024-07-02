import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

import parser from 'parse-neo4j';

// for updating general info
export const editBook = asyncHandler(async(req,res) => {

    const bookData = req.body;

    console.log(bookData);

    // query whether book exists or not
    const query1 = `
        MATCH (b:Book {isbn : $isbn})
        RETURN b
    `;

    const result = await driver.executeQuery(query1 , {isbn : bookData.isbn});
    const resultArray = parser.parse(result);

    // if doesnt exists then return 
    if(resultArray.length === 0){
        res.status(400);
        throw new Error("Book doesn't exists.");
    }

    // otherwise check if no of copies is updated or not
    else if(bookData.no_of_copies){
        res.status(400);
        throw new Error("Availability/# of copies is not ediitable.");
    }
    // different author , delete prev author rel create if any
    else if(resultArray[0].author_name !== bookData.author_name){

        const query = `
        MATCH (book:Book {isbn : $isbn}),
        (author:Author)-[r:WROTE]->(book)
        DELETE r;

        

        `;

        const result =  await driver.executeQuery(
            query ,
             {
                isbn : resultArray[0].isbn, 
                author_name : resultArray[0].author_name
            });
        
        const response = parser.parse(result);

        console.log("Response after changing author => ",response);

    }

    // different subject , delete prev subject rel create if any
    else if(resultArray[0].sub_name !== bookData.sub_name){
        const query = `
        MATCH (book:Book {isbn : $isbn}),
        (subject:Subject)-[r:CONTAINS]->(book)
        DELETE r
        `;

        const result =  await driver.executeQuery(
            query ,
             {isbn : resultArray[0].isbn, 
                sub_name : resultArray[0].sub_name}
            );
        
        const response = parser.parse(result);

        console.log("Response after changing subject => ",response);

    }
    // query in db
    const query = `

        MATCH (book:Book {isbn : $isbn})

        SET book += {
            shelving_no : $shelving_no,
            date_of_publication: $date_of_publication,
            edition: $edition, 
            description: $description, 
            title: $title, 
            cover_img: $cover_img
        }

        WITH book

        OPTIONAL MATCH (existingAuthor:Author {author_name: $author_name})
        WHERE existingAuthor IS NULL  // Check if node exists
        MERGE (author:Author {author_name: $author_name})
        
        WITH book,author

        CREATE (author)-[:WROTE]-> (book)

        WITH book,author

        OPTIONAL MATCH (existingSubject:Subject {sub_name: $sub_name})
        WHERE existingSubject IS NULL  // Check if node exists
        MERGE (subject:Subject {sub_name: $sub_name})
        
        WITH book,subject,author

        CREATE (subject)-[:CONTAINS]-> (book)

        RETURN book,author.author_name as author_name

    `;

    const resultBookPromise = await driver
    .executeQuery(
      query,bookData
    )
    .catch((parseError) => {
      console.error(`Parsing error: ${parseError}`); 
      res.status(500);
      throw new Error("Data parsing error");
    });

    const responseArray = parser.parse(resultBookPromise);
    console.log("Query result After Edit: ", responseArray);

   

    res.status(200).send({ message : "Book editted successfully"});
})