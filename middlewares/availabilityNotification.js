import { sendMessge } from "../utils/sendWhatsappMssg.js";
import driver from "../utils/neo4j-driver.js";
import parser from "parse-neo4j";

const notify = async (isbn, title) => {
  const findMemberQuery = `MATCH (m : Member)-[:WISHLIST]->(b : Book {isbn: $isbn}) RETURN  m`;
  const context = { isbn: isbn };
  const response = await driver.executeQuery(findMemberQuery, context);
  const members = parser.parse(response);
  const mesasgeBody = `Your Book with title ${title} is available`;
  members.forEach((member) => {
    console.log(member.membership_id);
    console.log(member.phone_number);
    console.log("Whatsapp api");
    sendMessge(member.phone_number, mesasgeBody);
  });
};

export const notifyOnAvailable = async (req, res, next) => {
  const isbn = req.body.isbn;
  let updatedCount = req.body.updatedCount;
  if (!isbn) {
    console.log("UNDEFINED BOOK ID");
    next(new Error("UNDEFINED BOOK ID"));
    return;
  }
  const checkQuery = `MATCH (b:Book {isbn: $isbn}) RETURN b`;
  const checkContext = { isbn: isbn };
  try {
    const response = parser.parse(
      await driver.executeQuery(checkQuery, checkContext)
    );

    const copyFreq = response[0].no_of_copies;
    if (updatedCount === undefined) {
      updatedCount = 1;
    }
    if (copyFreq == 0 && updatedCount > 0) {
      await notify(isbn, response[0].title);
      console.log("Notify the people");
    }
    console.log(copyFreq);
    next();
  } catch (error) {
    res.status(404);
    next(new Error("Book not found"));
  }
};
