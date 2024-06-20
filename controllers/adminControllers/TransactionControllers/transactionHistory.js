import driver,{ convertToNeo4jInteger }  from "../../../utils/neo4j-driver.js"
import parser from "parse-neo4j";
// import asyncHandler from "express-async-handler"

export const getHistory = async (req, res) => {
    try {
        const { memberId, isbn, status } = req.query;
        let count =parseInt(req.query.count,10);
        if(!count){
            // console.log(count);
            count=200;
        }
        const temp=convertToNeo4jInteger(count);
        count=temp;
        // console.log(count);
        let query;
        if(!memberId && !isbn && !status){
            // console.log("000");
            query = `
            MATCH (m:Member)
            -[t:TRANSACTION]->(b:Book)
            WHERE t.status IN ["issued", "returned", "late"] 
            RETURN t AS transaction, b.isbn AS isbn, m.membership_id AS memberId
            ORDER BY date(datetime({ year: toInteger(substring(t.issue_date, 6, 4)), 
                month: toInteger(substring(t.issue_date, 3, 2)), 
                day: toInteger(substring(t.issue_date, 0, 2)) })) DESC
            LIMIT $count`;
        }
        else if(!memberId && !isbn && status){
            // console.log("001");
            query = `
            MATCH (m:Member )
            -[t:TRANSACTION]->(b:Book )
            WHERE (t.status = $status)
            RETURN t AS transaction, b.isbn AS isbn, m.membership_id AS memberId
            ORDER BY date(datetime({ year: toInteger(substring(t.issue_date, 6, 4)), 
                month: toInteger(substring(t.issue_date, 3, 2)), 
                day: toInteger(substring(t.issue_date, 0, 2)) })) DESC
            LIMIT $count`;
        }
        else if(!memberId && isbn && !status){
            // console.log("010");
            query = `
            MATCH (m:Member )
            -[t:TRANSACTION]->(b:Book {isbn: $isbn})
            WHERE t.status IN ["issued", "returned", "late"] 
            RETURN t AS transaction, b.isbn AS isbn, m.membership_id AS memberId
            ORDER BY date(datetime({ year: toInteger(substring(t.issue_date, 6, 4)), 
                month: toInteger(substring(t.issue_date, 3, 2)), 
                day: toInteger(substring(t.issue_date, 0, 2)) })) DESC
            LIMIT $count`;
        }
        else if(!memberId && isbn && status){
            // console.log("011");
            query = `
            MATCH (m:Member )
            -[t:TRANSACTION]->(b:Book {isbn: $isbn})
            WHERE (t.status = $status)
            RETURN t AS transaction, b.isbn AS isbn, m.membership_id AS memberId
            ORDER BY date(datetime({ year: toInteger(substring(t.issue_date, 6, 4)), 
                month: toInteger(substring(t.issue_date, 3, 2)), 
                day: toInteger(substring(t.issue_date, 0, 2)) })) DESC
            LIMIT $count`;
        }
        else if(memberId && !isbn && !status){
            // console.log("100");
            query = `
            MATCH (m:Member {membership_id: $memberId})
            -[t:TRANSACTION]->(b:Book )
            WHERE t.status IN ["issued", "returned", "late"] 
            RETURN t as transaction, b.isbn AS isbn, m.membership_id AS memberId
            ORDER BY date(datetime({ year: toInteger(substring(t.issue_date, 6, 4)), 
                month: toInteger(substring(t.issue_date, 3, 2)), 
                day: toInteger(substring(t.issue_date, 0, 2)) })) DESC
            LIMIT $count`;
        }
        else if(memberId && !isbn && status){
            // console.log("101");
            query = `
            MATCH (m:Member {membership_id: $memberId})
            -[t:TRANSACTION]->(b:Book )
            WHERE (t.status = $status)
            RETURN t AS transaction, b.isbn AS isbn, m.membership_id AS memberId
            ORDER BY date(datetime({ year: toInteger(substring(t.issue_date, 6, 4)), 
                month: toInteger(substring(t.issue_date, 3, 2)), 
                day: toInteger(substring(t.issue_date, 0, 2)) })) DESC
            LIMIT $count`;
        }
        else if (memberId && isbn && !status) {
            // console.log("110");
            query = `
            MATCH (m:Member {membership_id: $memberId})
            -[t:TRANSACTION]->(b:Book {isbn: $isbn})
            WHERE t.status IN ["issued", "returned", "late"] 
            RETURN t AS transaction, b.isbn AS isbn, m.membership_id AS memberId
            ORDER BY date(datetime({ year: toInteger(substring(t.issue_date, 6, 4)), 
                month: toInteger(substring(t.issue_date, 3, 2)), 
                day: toInteger(substring(t.issue_date, 0, 2)) })) DESC
            LIMIT $count`;
        }
        else {
            // console.log("111");
            query = `
            MATCH (m:Member {membership_id: $memberId})
            -[t:TRANSACTION]->(b:Book {isbn: $isbn})
            WHERE (t.status = $status)
            RETURN t AS transaction, b.isbn AS isbn, m.membership_id AS memberId
            ORDER BY date(datetime({ year: toInteger(substring(t.issue_date, 6, 4)), 
                month: toInteger(substring(t.issue_date, 3, 2)), 
                day: toInteger(substring(t.issue_date, 0, 2)) })) DESC
            LIMIT $count`;
        }
        
        const params = {
            memberId: memberId,
            isbn: isbn,
            status: status,
            count : count
        }
        const result = await driver.executeQuery(query, params);
        const response = parser.parse(result);
        // console.log(response.length);
        if (response.length === 0) {
            res.status(200).send({ message: "no transactions to show" });
        }
        else {
            res.status(200).send(response);
        }
    } catch (error) {
        console.error('Something went wrong:', error);
    }
    // res.send("TODO :History returned successfully");
}