import driver from "../../utils/neo4j-driver.js";
import { convertToNeo4jInteger } from "../../utils/neo4j-driver.js";
import asyncHandler from "express-async-handler";
import parser from "parse-neo4j";
import * as queries from './queries.js';


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
  const regexQuery = decodedStringValue.split('').map(char => `${char}.*`).join('');
  const regex = `(?i).*${regexQuery}`; // Case-insensitive subsequence match

  console.log("Regex is ", regex);

  var query;

  if(availability === "true"  && sortby === "edition") {
    query = queries.availableAndSortByEditionDesc;
  }
  else if(availability === "true"  && sortby === "popularity") {
    query = queries.availableAndSortByPopularityDesc;
  }
  else if(availability === "false"  && sortby === "edition") {
    query = queries.notAvailableAndSortByEditionDesc;
  }
  else if(availability === "true"  && sortby === "popularity") {
    query = queries.notAvailableAndSortByPopularityDesc;
  }
  else if(availability === "true"){
     query = queries.available;
  }
  else if(availability === "false"){
     query = queries.notAvailable;
  }
  else if(sortby === "edition"){
    query = queries.sortByEditionDesc;
  }
  else if(sortby === "popularity"){
     query = queries.sortByPopularityDesc;
  }
  else{
     query = queries.defaultQuery;
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
