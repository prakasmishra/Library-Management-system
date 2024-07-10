import driver from "../../../utils/neo4j-driver.js";
import moment from "moment";
import parser from "parse-neo4j";

export const currentlyBorrowedBooks = async (req, res) => {
    try {
        const memberId = req.params.memberId;
    
        const query = `
        MATCH (m:Member {membership_id: $member_id})
        -[:TRANSACTION {status: 'issued'}]->(b : Book)
        OPTIONAL MATCH (a:Author)-[:WROTE]->(b)
        OPTIONAL MATCH (s:Subject)-[:CONTAINS]->(b)
        RETURN b as book, a.author_name AS author_name, s.sub_name AS sub_name`;

        const params = {
            member_id: memberId
        }
        const result = await driver.executeQuery(query, params);
        const response = parser.parse(result);
        if(response.length === 0){
            res.status(200).send({ message: "you don't have any borrowed book" });
        }
        else{
            res.status(200).send(response);
        }
    } catch (error) {
        console.error('Something went wrong:', error);
    }
}

export const wishlistedBooks = async (req, res) => {
    try {
        const memberId = req.params.memberId;


        const query = `
        MATCH (m:Member {membership_id: $member_id})-[:WISHLIST]->(b:Book)
        OPTIONAL MATCH (a:Author)-[:WROTE]->(b)
        OPTIONAL MATCH (s:Subject)-[:CONTAINS]->(b)
        RETURN b as book, a.author_name AS author_name, s.sub_name AS sub_name`;

        const params = { member_id: memberId }
        const result = await driver.executeQuery(query, params);
        const response = parser.parse(result);
        if(response.length===0){
            res.status(200).send({ message: "no books  added to wishlist yet" });
        }
        else{
            res.status(200).send(response);
        }
    } catch (error) {
        console.error('Something went wrong:', error);
    }
}

export const borrowingHistory = async (req, res) => {
    try {
        const memberId = req.params.memberId;
        const range = parseInt(req.query.range, 10);

        // Get the current date
        const currentDate = moment();

        // Subtract 3 months from the current date
        const threeMonthsAgo = currentDate.subtract(range, 'months');
        // console.log(threeMonthsAgo);
        // Format the result back to the desired format
        const resultDateString = threeMonthsAgo.format("YYYY-MM-DD");
        console.log("Date 3 months before today:", resultDateString);

        const query = `
        MATCH (member:Member {membership_id: $member_id})-[r:TRANSACTION]->(book:Book)
        WHERE r.status IN ["issued", "returned", "late"] 
        AND date(datetime({year: toInteger(split(r.issue_date, '-')[2]), 
        month: toInteger(split(r.issue_date, '-')[1]), 
        day: toInteger(split(r.issue_date, '-')[0])})) > date($resultDateString)
        OPTIONAL MATCH (a:Author)-[:WROTE]->(book)
        OPTIONAL MATCH (s:Subject)-[:CONTAINS]->(book)
        RETURN book.title AS title,a.author_name AS author_name,r.status AS status,
        r.issue_date AS issue_date,r.due_date AS due_date, r.return_date AS return_date`;

        const params = {
            member_id: memberId,
            resultDateString: resultDateString
        }
        const result = await driver.executeQuery(query, params);
        const response = parser.parse(result);
        if(response.length===0){
            res.status(200).send({ message: "History is empty" });
        }
        else{
            res.status(200).send(response);
        }
    } catch (error) {
        console.error('Something went wrong:', error);
    }
}