import driver from "../../../utils/neo4j-driver.js";

export const currentlyBorrowedBooks = async (req, res) => {
    const memberId = req.params.memberId;
    const result = await driver.executeQuery(`
    MATCH (m:Member {membership_id: $member_id})-[:TRANSACTION {status: 'issued'}]->(b:Book)
    RETURN b
    `, {member_id : memberId}
    )
    for (let book of result.records) {
        console.log(book.get('b').properties);
    }
    // console.log(result.records._fields.properties);
    res.status(200).send({ message : "currently borrowed books api controller"});
}

export const borrowingHistory = async (req, res) => {
    res.status(200).send({ message : "borrowing history api controller"});
}

export const wishlistedBooks = async (req, res) => {
    res.status(200).send({ message : "wishlisted books api controller"});
}