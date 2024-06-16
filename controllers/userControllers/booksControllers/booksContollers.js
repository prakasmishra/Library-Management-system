import driver from "../../../utils/neo4j-driver.js";

export const reserveBook = async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const isbn = req.params.isbn;

    const query = `
        MATCH (member:Member {membership_id: $member_id}), (book:Book {isbn: $isbn})
        MERGE (member)-[:TRANSACTION {
            lib_card_no: toInteger(-1),
            copy_no : toInteger(-1),
            status : "booked",
            issue_date : "00-00-0000",
            due_date :"00-00-0000",
            return_date :"00-00-0000",
            fine : toInteger(0)
        }]->(book)`;

    const params = {
      member_id: memberId,
      isbn: isbn,
    };
    const result = await driver.executeQuery(query, params);
    res.status(200).send({ message: "book reserved" });
  } catch (error) {
    console.error("Something went wrong:", error);
  }
};

export const wishlistBook = async (req, res) => {
  try {
    const memberId = req.params.memberId;
    const isbn = req.params.isbn;

    const query = `
        MATCH (member:Member {membership_id: $member_id}), (book:Book {isbn: $isbn})
        MERGE (member)-[:WISHLIST]->(book)`;

    const params = {
      member_id: memberId,
      isbn: isbn,
    };
    const result = await driver.executeQuery(query, params);
    res.status(200).send({ message: "wishlisted" });
  } catch (error) {
    console.error("Something went wrong:", error);
  }
};

export const recommendedBooks = async (req, res) => {
  try {
    const subject = req.query.subject;
    if (subject === null || subject === undefined || subject.trim() === "") {
      const query = `match (b : Book) return b`;
      const context = {};
      const result = await driver.executeQuery(query, context);
      const books = result.records.map((record) => record.get("b").properties);
      books.sort((a, b) => b.popularity.low - a.popularity.low);
      res.status(200).send(books);
      books.forEach((book) => console.log(book.title));
    } else {
      const query = `MATCH (s:Subject {sub_name : $subject})-[:CONTAINS]->(b : Book) RETURN b`;
      const context = { subject: subject };
      const result = await driver.executeQuery(query, context);
      const books = result.records.map((record) => record.get("b").properties);
      books.sort((a, b) => b.popularity.low - a.popularity.low);
      books.forEach((book) => console.log(book.title));
      res.status(200).send(books);
    }
  } catch (error) {
    res.status(500).send({ Error: error });
  }
};
