import driver from "../../../utils/neo4j-driver.js";

export const currentlyBorrowedBooks = async (req, res) => {
    try {
        const memberId = req.params.memberId;
        const result = await driver.executeQuery(`
        MATCH (m:Member {membership_id: $member_id})-[:TRANSACTION {status: 'issued'}]->(b:Book)
        RETURN b
        `, { member_id: memberId }
        )
        const response = [];
        for (let book of result.records) {
            console.log(book.get('b').properties);
            response.push(book.get('b').properties);
        }
        res.status(200).send(response);
    } catch (error) {
        console.error('Something went wrong:', error);
    }
}

export const wishlistedBooks = async (req, res) => {
    try {
        const memberId = req.params.memberId;
        const result = await driver.executeQuery(`
        MATCH (m:Member {membership_id: $member_id})-[:WISHLIST]->(b:Book)
        RETURN b
        `, { member_id: memberId }
        )
        const response = [];
        for (let book of result.records) {
            console.log(book.get('b').properties);
            response.push(book.get('b').properties);
        }
        // console.log(result.records._fields.properties);
        res.status(200).send(response);
    } catch (error) {
        console.error('Something went wrong:', error);
    }
}

export const borrowingHistory = async (req, res) => {
    res.status(200).send({ message: "borrowing history api controller" });
}