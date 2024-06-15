import driver from "../../utils/neo4j-driver.js";
import { convertToNeo4jInteger } from "../../utils/neo4j-driver.js";
import asyncHandler from "express-async-handler";
import parser from "parse-neo4j";


export const searchBooks = asyncHandler(async (req, res) => {
  
// 1.extracting path vars and query params
  
  const stringValue = req.params.string_value.replace(/\+/g, "%20");// replaces '+' with %20
  const decodedStringValue = decodeURIComponent(stringValue);// decodes %20 as ' '
  console.log(`String-value-terms = ${decodedStringValue}`);

  // availability=0(not)/1 sortby=0(edition)/1(publication-date)/2(popularity)
  const { availability, sortby } = req.query;
  console.log(`availability = ${availability} , ${typeof availability} `);
  console.log(`sortby = ${sortby}`);

  const limit = convertToNeo4jInteger(10);

  // querying the db

  const regexQuery = decodedStringValue.split('').map(char => `${char}.*`).join('');
  const regex = `(?i).*${regexQuery}`; // Case-insensitive subsequence match

  console.log("Regex is ", regex);

  const query = `MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
WHERE book.title =~ $regex 
OR author.author_name =~ $regex
OR subject.sub_name =~ $regex
RETURN book
LIMIT $limit
`;

  const resultBooksPromise = await driver
    .executeQuery(
      query,
      {regex : regex,limit : limit}
    )
    .catch((parseError) => {
      console.error(`Parsing error: ${parseError}`); 
    });

  const responseArray = parser.parse(resultBooksPromise);
  console.log("Query result: ", responseArray);

  res.status(200).send(responseArray);
});
