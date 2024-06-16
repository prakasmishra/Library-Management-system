import driver from "../../../utils/neo4j-driver.js";
import parser from "parse-neo4j";

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
            isbn: isbn
        };
        const helperResult = await driver.executeQuery(helperQuery, helperParams);
        const response = parser.parse(helperResult);
        if (response.length === 0) {
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
                isbn: isbn
            };
            const result = await driver.executeQuery(query, params);
            res.status(200).send({ message: "book reserved" });
            console.log("hello");
        }
        else {
            res.status(200).send({ message: "book already issued or booked" });
        }
    } catch (error) {
        console.error('Something went wrong:', error);
    }
}

export const wishlistBook = async (req, res) => {
    try {
        const memberId = req.params.memberId;
        const isbn = req.params.isbn;

        const query = `
        MATCH (member:Member {membership_id: $member_id}), (book:Book {isbn: $isbn})
        MERGE (member)-[:WISHLIST]->(book)`;

        const params = {
            member_id: memberId,
            isbn: isbn
        };
        const result = await driver.executeQuery(query, params);
        res.status(200).send({ message: "wishlisted" });
    } catch (error) {
        console.error('Something went wrong:', error);
    }
}
