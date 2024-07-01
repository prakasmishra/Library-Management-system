import driver from "../../utils/neo4j-driver.js";
import { convertToNeo4jInteger } from "../../utils/neo4j-driver.js";
import asyncHandler from "express-async-handler";
import parser from "parse-neo4j";
import * as queries from './queries.js';
import { removeStopWords } from "./removeStopWords.js";



export const searchBooks = asyncHandler(async (req, res) => {
  
  // 1.extracting path vars and query params
    
  const stringValue = req.params.string_value.replace(/\+/g, "%20");// replaces '+' with %20
  const decodedStringValue = decodeURIComponent(stringValue);// decodes %20 as ' '
  console.log(`String-value-terms = ${decodedStringValue}`);
  
  // availability=true/false sortby=edition/popularity
    const { availability, sortby  } = req.query;
    console.log(`availability = ${availability} , ${typeof availability} `);
    console.log(`sortby = ${sortby}`);
    
    
    const limit = convertToNeo4jInteger(process.env.MAX_API_BOOK_LIMIT);
    
    // querying the db
    // check for better regex
    // using subseq
    //   const regexQuery = decodedStringValue.split('').map(char => `${char}.*`).join('');
    //   const regex = `(?i).*${regexQuery}`; // Case-insensitive subsequence match
  
    // const regexQuery
    const regex = removeStopWords(decodedStringValue.split(' ').map(str => str.toLowerCase()));  
    console.log("Regex is ", regex);
    // return;  
    
    var query;
    
    if(availability === "true"  && sortby === "edition") {
      query = queries.availableAndSortByEditionDesc;
    }
    else if(availability === "true"  && sortby === "popularity"){
      query = queries.availableAndSortByPopularityDesc;
    }
    else if(availability === "false"  && sortby === "edition") {
      query = queries.sortByEditionDesc;
    }
    else if(availability === "true"  && sortby === "popularity") {
      query = queries.sortByPopularityDesc;
    }
    else{
       query = queries.sortByPopularityDesc;
    }
    console.log(query);
  
    
    
    const resultBooksPromise = await driver
    .executeQuery(
      query,
      {regex : regex,limit : limit}
    )
    .catch((parseError) => {
      console.error(`Parsing error: ${parseError}`); 
      res.status(500);
      throw new Error("Data parsing error");
    });
    
    const responseArray = parser.parse(resultBooksPromise);
    console.log("Query result: ", responseArray.length);
    
    res.status(200).send(responseArray);
  });
  
//*********** Using indexes ***************** */

//   export const searchBooks2 = asyncHandler(async(req,res) => {
    
//     const stringValue = req.params.string_value.replace(/\+/g, "%20");// replaces '+' with %20
//     const decodedStringValue = decodeURIComponent(stringValue);// decodes %20 as ' '
//     console.log(`String-value-terms = ${decodedStringValue}`);
    
//     // availability=true/false sortby=edition/popularity
//     const { availability, sortby  } = req.query;
//     console.log(`availability = ${availability} , ${typeof availability} `);
//     console.log(`sortby = ${sortby}`);
    
    
//     const limit = convertToNeo4jInteger(process.env.MAX_API_BOOK_LIMIT);
    
    
//   await createIndexes();


//   const query = 'CREATE FULLTEXT INDEX  book_index  if not exists FOR (b:Book) ON EACH [b.title];';

//   // querying the db
//   // check for better regex
  
//   const resultBooksPromise = await driver
//     .executeQuery(
//       query
//     )
//     .catch((parseError) => {
//       console.error(`Parsing error: ${parseError}`); 
//       res.status(500);
//       throw new Error("Data parsing error");
//     });

//   const responseArray = parser.parse(resultBooksPromise);
//   console.log("Query result: ", responseArray.length);

//   res.status(200).send(responseArray);
// })

// const createIndexes = async()=>{
//     const checkBookIndex = 'SHOW FULLTEXT INDEXES WHERE name CONTAINS "book_index"';
//     const createBookIndex = 'CREATE FULLTEXT INDEX book_index IF NOT EXISTS FOR (b:Book) ON EACH [b.title]';
//     const checkAuthorIndex = 'SHOW FULLTEXT INDEXES WHERE name CONTAINS "author_index"';
//     const createAuthorIndex = 'CREATE FULLTEXT INDEX author_index IF NOT EXISTS FOR (a:Author) ON EACH [a.author_name]';
//     const checkSubjectIndex = 'SHOW FULLTEXT INDEXES WHERE name CONTAINS "subject_index"';
//     const createSubjectIndex = 'CREATE FULLTEXT INDEX subject_index IF NOT EXISTS FOR (s:Subject)  ON EACH [s.sub_name]';

//     const bookIndexExists = parser.parse(await driver.executeQuery(checkBookIndex));
//     if(bookIndexExists.length === 0){
//        await driver.executeQuery(createBookIndex);
//     }

//     const authorIndexExists = parser.parse(await driver.executeQuery(checkAuthorIndex));
//     if(authorIndexExists.length === 0){
//        await driver.executeQuery(createAuthorIndex);
//     }

//     const subjectIndexExists = parser.parse(await driver.executeQuery(checkSubjectIndex));
//     if(subjectIndexExists.length === 0){
//        await driver.executeQuery(createSubjectIndex);
//     }
// }


/*


WITH CASE WHEN db.index.fulltext.exists("book_index") THEN true ELSE false END AS bookIndexExists,
     CASE WHEN db.index.fulltext.exists("author_index") THEN true ELSE false END AS authorIndexExists,
     CASE WHEN db.index.fulltext.exists("subject_index") THEN true ELSE false END AS subjectIndexExists
WITH bookIndexExists,authorIndexExists,subjectIndexExists
// Conditional creation for book_index
CREATE FULLTEXT INDEX book_index FOR (b:Book) ON EACH [b.title]
WHEN NOT bookIndexExists

// Conditional creation for author_index (similar structure)
CREATE FULLTEXT INDEX author_index FOR (a:Author) ON EACH [a.author_name]
WHEN NOT authorIndexExists

// Conditional creation for subject_index (similar structure)
CREATE FULLTEXT INDEX subject_index FOR (s:Subject) ON EACH [s.sub_name]
WHEN NOT subjectIndexExists

// Return message (optional)
RETURN "Full-text indexes created (if not already existing)"



CALL db.index.fulltext.queryNodes("book_index", "temdynamics~") YIELD node, score
RETURN node, score

*/