import expressAsyncHandler from "express-async-handler";
import driver from "../../../utils/neo4j-driver.js";
import { sendNotificationEmail } from "../../adminControllers/NotificationControllers/notificationController.js";
import asyncHandler from "express-async-handler";

const limit = parseInt(process.env.MAX_API_BOOK_LIMIT,10);
import parser from "parse-neo4j";
import { formatDate } from "./utils/formatDate.js";
import { generateEtask } from "../../commonControllers/generateEtask.js";
import { sendEtaskToAdmin } from "../../../sockets/admin.js";
export const reserveBook = async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const isbn = req.params.isbn;
    const helperQuery = `
        MATCH (member:Member {membership_id: $member_id})
        -[r:TRANSACTION]->(book:Book {isbn: $isbn})
        WHERE r.status IN ["issued","booked"]
        RETURN r.status`;

    const helperParams = {
      member_id: memberId,
      isbn: isbn,
    };
    const helperResult = await driver.executeQuery(helperQuery, helperParams);
    const response = parser.parse(helperResult);
    if (response.length === 0) {
      const query = `
            MATCH (member:Member {membership_id: $member_id}), (book:Book {isbn: $isbn})
            CREATE (member)-[t:TRANSACTION {
            lib_card_no: toInteger(-1),
            copy_no : toInteger(-1),
            status : "booked",
            fine : toInteger(0)
            }]->(book)
            RETURN t
            `;
      const params = {
        member_id: memberId,
        isbn: isbn,
      };
      const result = await driver.executeQuery(query, params);

      if(result.length === 0){
         throw new Error("Server error");
      }
      //sending notification emails to admins
      //await sendNotificationEmail(req, res);

      res.status(200).send({ message: "book reserved" });
      // console.log("hello");
    } else {
      res.status(200).send({ message: "book already issued or booked" });
    }
  } catch (error) {
    console.error("Something went wrong:", error);
  }
};


export const requestRenewBook = expressAsyncHandler( async (req, res) => {
    const memberId = req.params.memberId;
    const isbn = req.params.isbn;
    const helperQuery = `
        MATCH (member:Member {membership_id: $member_id})
        -[r:TRANSACTION {status : 'issued'} ]->(book:Book {isbn: $isbn})
        RETURN r`;

    const helperParams = {
      member_id: memberId,
      isbn: isbn,
    };
    const helperResult = await driver.executeQuery(helperQuery, helperParams);
    const response = parser.parse(helperResult);

    console.log(response);

    if (response.length === 0) {
      res.status(400);
      throw new Error("Book not issued prevoiusly");
    }
    else if(response[0].renewal_count <= 0){
      res.status(400);
      throw new Error("Renewal count is 0,cannot renew more");
    }
    else {

      //TODO: 1. create e-task of renewal request

      const today = formatDate(new Date());

      const etaskObj = {
        title : "Request for Renewal",
        description : "This is an request for renewal of a book by a member.The transaction details is provided below.",
        due_date : today,
        type : "request-renenwal",
        additional_details :
          {
            id: response[0].id,
            issue_date: response[0].issue_date,
            lib_card_no: response[0].lib_card_no,
            due_date: response[0].due_date,
            renewal_count: response[0].renewal_count,
            copy_no: response[0].copy_no,
            status: response[0].status
        }
      }

      const result = await generateEtask(etaskObj);

      //TODO: 2. send EtaskTo admin 
      sendEtaskToAdmin(etaskObj);

      res.status(200).send({ message: "Renewal request sent" });
    }

});



export const addWishlistBook = asyncHandler( async (req, res) => {
    const memberId = req.params.memberId;
    const isbn = req.params.isbn;

    const checkQuery = `MATCH (m:Member{membership_id: $member_id}) RETURN m.membership_id`;

    const helperQuery = `
        MATCH (m:Member{membership_id: $member_id}) 
        -[:WISHLIST]-> (book:Book {isbn: $isbn})
        RETURN m.membership_id AS id`;

    const params = {
      member_id: memberId,
      isbn: isbn,
    };
    const checkQueryResult = await driver.executeQuery(checkQuery, params);
    const checkResponse = parser.parse(checkQueryResult);
    if (checkResponse.length == 0) {
      res.status(400).send({ message: "Member does not exist" });
    }
    else {

      const helperResult = await driver.executeQuery(helperQuery, params);
      const response = parser.parse(helperResult);
      if (response.length === 0) {
        const query = `
        MATCH (member:Member {membership_id: $member_id}), (book:Book {isbn: $isbn})
        MERGE (member)-[:WISHLIST]->(book)`;

        const result = await driver.executeQuery(query, params);
        if(result.length === 0){
           res.status(500);
           throw new Error("Error in wishlisting");
        }
        res.status(200).send({ message: "wishlisted successfully" });
      } else {
        res.status(400).send({ message: "Already in your wishlist" });
      }
    }
});


export const removeWishlistBook = asyncHandler(async (req, res) => {
    const memberId = req.params.memberId;
    const isbn = req.params.isbn;

    const checkQuery = `MATCH (m:Member{membership_id: $member_id}) RETURN m.membership_id`;

    const helperQuery = `
        MATCH (m:Member{membership_id: $member_id}) 
        -[:WISHLIST]-> (book:Book {isbn: $isbn})
        RETURN m.membership_id AS id`;

    const params = {
      member_id: memberId,
      isbn: isbn,
    };
    const checkQueryResult = await driver.executeQuery(checkQuery, params);
    const checkResponse = parser.parse(checkQueryResult);
    if (checkResponse.length == 0) {
      res.status(400).send({ message: "Member does not exist" });
    }
    else {

      const helperResult = await driver.executeQuery(helperQuery, params);
      const response = parser.parse(helperResult);
      if (response.length === 0) {
        res.status(400);
        throw new Error("Book is not wishlisted");
      } else {
        
        const query = `
        MATCH (:Member {membership_id: $member_id})-[r:WISHLIST]->(:Book {isbn: $isbn})
        DELETE r`;

        const result = await driver.executeQuery(query, params);
        if(result.length === 0){
          res.status(500);
          throw new Error("Error in un-wishlisting");
        }
        res.status(200).send({ message: "Book removed from wishlist successfully." });
      }
    }
});



export const recommendedBooks = async (req, res) => {
  try {
    const subject = req.query.subject;
    if (subject === null || subject === undefined || subject.trim() === "") {
      const query = `
      MATCH (book:Book)
, (author:Author)-[wr:WROTE]->(book)
, (subject:Subject) -[:CONTAINS]-> (book)
RETURN book,author.author_name AS author_name,subject.sub_name AS sub_name
      `;
      const context = {};
      const result = await driver.executeQuery(query, context);
      //   const books = result.records.map((record) => record.get("b").properties);
      const books = parser.parse(result);
      const popularBooks = books
        .sort((a, b) => b.book.popularity - a.book.popularity)
        .slice(0, limit);
      popularBooks.forEach((book) => console.log(book.book.title));
      res.status(200).send(popularBooks);
    } else {
      const query = `
     MATCH (book:Book)
  , (author:Author)-[wr:WROTE]->(book)
  , (subject:Subject)-[:CONTAINS]->(book)
  WHERE toLower(subject.sub_name) =~ (toLower($subject)) 
RETURN book, author.author_name AS author_name, subject.sub_name AS sub_name

      `;
      const context = { subject: subject };
      const result = await driver.executeQuery(query, context);
      const books = parser.parse(result);
      const popularBooks = books
        .sort((a, b) => b.book.popularity - a.book.popularity)
        .slice(0, limit);
      popularBooks.forEach((book) => console.log(book.book.title));
      res.status(200).send(popularBooks);
    }
  } catch (error) {
    console.log('Error :',error);
    res.status(500).send({ Error: error });
  }
};


export const relatedBooks = async (req, res) => {
  try {
    const isbn = req.params.isbn;
    // console.log(isbn);
    const query = `MATCH (: Book {isbn : $isbn})<-[:CONTAINS]-(subject:Subject)-[:CONTAINS]->(book: Book),
    (book)<-[:WROTE]-(author:Author) RETURN book, author.author_name AS author_name, subject.sub_name AS sub_name
    `;
    const context = { isbn: isbn };
    const result = await driver.executeQuery(query, context);
    const books = parser.parse(result);
    const popularBooks = books
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, limit);
      popularBooks.forEach((book) => console.log(book.book.title));
      res.status(200).send(popularBooks);
  } catch (error) {
    res.status(500).send({ Error: error });
  }
};

