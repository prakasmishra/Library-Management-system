import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"
import { checkBookExistence } from "./utils/checkBookExistence.js";
import parser from "parse-neo4j";

export const addNewBook = asyncHandler(async(req,res) => {

    // id and popularity needed

    const bookData = req.body;

    const bookExists = await checkBookExistence(bookData.isbn);
    
    console.log("Book exist ",bookExists);


    if(bookExists){
        res.status(400).send({message : "Book already exists."});
        res.end();
        return;
    }

    // query in db
    const query = `
        CREATE (book:Book 
        {
            isbn : $isbn,
            shelving_no : $shelving_no,
            date_of_publication: $date_of_publication,
            edition: $edition, 
            no_of_copies: $no_of_copies, 
            description: $description, 
            title: $title, 
            cover_img: $cover_img, 
            popularity: 0
        })
        WITH book

        OPTIONAL MATCH (existingAuthor:Author {author_name: $author_name})
        WHERE existingAuthor IS NULL  // Check if node exists
        MERGE (author:Author {author_name: $author_name})

        WITH book,author
        OPTIONAL MATCH (existingSubject:Subject {sub_name: $sub_name})
        WHERE existingSubject IS NULL  // Check if node exists
        MERGE (subject:Subject {sub_name: $sub_name})
        
        WITH book,author,subject

        CREATE (author)-[:WROTE]-> (book)
        CREATE (subject)-[:CONTAINS]-> (book)

        return subject,author,book;
    `;

    const resultBookPromise = await driver
    .executeQuery(
      query,bookData
    )
    .catch((parseError) => {
      console.error(`Parsing error: ${parseError}`); 
      res.status(400).send({message : "Parsing error."});
    });

    const responseArray = parser.parse(resultBookPromise);
    console.log("Query result: ", responseArray);

    console.log(bookData);

    res.status(200).send({ message : "New book added successfully"});
})







/*


:param {

  shelving_no: "sh-0-4",
		isbn: "978-1-12765-028-0",
		date_of_publication: "18-09-2010",
		edition: 6,
		no_of_copies: 15,
		description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ac tellus eget tortor commodo condimentum a ac odio",
		title: "myBook1",
		cover_img: "https://www.pngkey.com/png/detail/350-3500680_placeholder-open-book-silhouette-vector.png",
	  author_name : "Arpan",
		sub_name : "Math"

};
OPTIONAL MATCH (existingBook:Book {isbn: $isbn})
        WHERE existingBook IS NULL
        MERGE (book:Book 
        {
            isbn : $isbn,
            shelving_no : $shelving_no,
            date_of_publication: $date_of_publication,
            edition: $edition, 
            no_of_copies: $no_of_copies, 
            description: $description, 
            title: $title, 
            cover_img: $cover_img, 
            popularity: 0
        })
        WITH book

        OPTIONAL MATCH (existingAuthor:Author {author_name: $author_name})
        WHERE existingAuthor IS NULL  // Check if node exists
        MERGE (author:Author {author_name: $author_name})

        WITH book,author
        OPTIONAL MATCH (existingSubject:Subject {sub_name: $sub_name})
        WHERE existingSubject IS NULL  // Check if node exists
        MERGE (subject:Subject {sub_name: $sub_name})
        
        WITH book,author,subject

        OPTIONAL MATCH (author) -[r1:WROTE]-> (book)
        WHERE r1 IS NULL
        MERGE (author)-[:WROTE]-> (book)

        WITH book,author,subject,r1

        OPTIONAL MATCH (subject) -[r2:CONTAINS]-> (book)
        WHERE r2 IS NULL
        MERGE (subject)-[:CONTAINS]-> (book)

        return subject,author,book;
        



*/