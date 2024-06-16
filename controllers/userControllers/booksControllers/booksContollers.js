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
            isbn: isbn
        };
        const result = await driver.executeQuery(query, params );
        res.status(200).send({ message: "book reserved" });
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

        const params =  {
            member_id: memberId,
            isbn: isbn
        };
        const result = await driver.executeQuery(query , params );
        res.status(200).send({ message: "wishlisted" });
    } catch (error) {
        console.error('Something went wrong:', error);
    }
}
