import driver,{ convertToNeo4jInteger }  from "../../../utils/neo4j-driver.js"
import parser from "parse-neo4j";
import { formatDateToYYYYMMDD } from "./utils/formatToUs.js";
// import asyncHandler from "express-async-handler"

export const getHistory = async (req, res) => {
    try {
        const { memberId, isbn, status } = req.query;

        let {firstdate}  = req.query;

        if(!firstdate){
            firstdate = "01-01-0000";           
        }

        firstdate = formatDateToYYYYMMDD(firstdate);
        console.log(`${memberId} - ${isbn} - ${status} - ${firstdate}`);

        // console.log(firstdate);
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

             AND
             (
                date(datetime({year: toInteger(split(t.issue_date, '-')[2]), 
                month: toInteger(split(t.issue_date, '-')[1]), 
                day: toInteger(split(t.issue_date, '-')[0])})) >= date($firstdate)

                OR 

                    (
                        t.status = 'returned' AND
                        date(datetime({year: toInteger(split(t.return_date, '-')[2]), 
                        month: toInteger(split(t.return_date, '-')[1]), 
                        day: toInteger(split(t.return_date, '-')[0])})) >= date($firstdate)
                    )
    
            )


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


            AND
             (
                date(datetime({year: toInteger(split(t.issue_date, '-')[2]), 
                month: toInteger(split(t.issue_date, '-')[1]), 
                day: toInteger(split(t.issue_date, '-')[0])})) >= date($firstdate)

                OR 

                    (
                        t.status = 'returned' AND
                        date(datetime({year: toInteger(split(t.return_date, '-')[2]), 
                        month: toInteger(split(t.return_date, '-')[1]), 
                        day: toInteger(split(t.return_date, '-')[0])})) >= date($firstdate)
                    )
    
            )

            
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

            AND
             (
                date(datetime({year: toInteger(split(t.issue_date, '-')[2]), 
                month: toInteger(split(t.issue_date, '-')[1]), 
                day: toInteger(split(t.issue_date, '-')[0])})) >= date($firstdate)

                OR 

                    (
                        t.status = 'returned' AND
                        date(datetime({year: toInteger(split(t.return_date, '-')[2]), 
                        month: toInteger(split(t.return_date, '-')[1]), 
                        day: toInteger(split(t.return_date, '-')[0])})) >= date($firstdate)
                    )
    
            )

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

            AND
             (
                date(datetime({year: toInteger(split(t.issue_date, '-')[2]), 
                month: toInteger(split(t.issue_date, '-')[1]), 
                day: toInteger(split(t.issue_date, '-')[0])})) >= date($firstdate)

                OR 

                    (
                        t.status = 'returned' AND
                        date(datetime({year: toInteger(split(t.return_date, '-')[2]), 
                        month: toInteger(split(t.return_date, '-')[1]), 
                        day: toInteger(split(t.return_date, '-')[0])})) >= date($firstdate)
                    )
    
            )


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


            AND
             (
                date(datetime({year: toInteger(split(t.issue_date, '-')[2]), 
                month: toInteger(split(t.issue_date, '-')[1]), 
                day: toInteger(split(t.issue_date, '-')[0])})) >= date($firstdate)

                OR 

                    (
                        t.status = 'returned' AND
                        date(datetime({year: toInteger(split(t.return_date, '-')[2]), 
                        month: toInteger(split(t.return_date, '-')[1]), 
                        day: toInteger(split(t.return_date, '-')[0])})) >= date($firstdate)
                    )
    
            )


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


            AND
             (
                date(datetime({year: toInteger(split(t.issue_date, '-')[2]), 
                month: toInteger(split(t.issue_date, '-')[1]), 
                day: toInteger(split(t.issue_date, '-')[0])})) >= date($firstdate)

                OR 

                    (
                        t.status = 'returned' AND
                        date(datetime({year: toInteger(split(t.return_date, '-')[2]), 
                        month: toInteger(split(t.return_date, '-')[1]), 
                        day: toInteger(split(t.return_date, '-')[0])})) >= date($firstdate)
                    )
    
            )


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


            AND
             (
                date(datetime({year: toInteger(split(t.issue_date, '-')[2]), 
                month: toInteger(split(t.issue_date, '-')[1]), 
                day: toInteger(split(t.issue_date, '-')[0])})) >= date($firstdate)

                OR 

                    (
                        t.status = 'returned' AND
                        date(datetime({year: toInteger(split(t.return_date, '-')[2]), 
                        month: toInteger(split(t.return_date, '-')[1]), 
                        day: toInteger(split(t.return_date, '-')[0])})) >= date($firstdate)
                    )
    
            )


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

            AND
             (
                date(datetime({year: toInteger(split(t.issue_date, '-')[2]), 
                month: toInteger(split(t.issue_date, '-')[1]), 
                day: toInteger(split(t.issue_date, '-')[0])})) >= date($firstdate)

                OR 

                    (
                        t.status = 'returned' AND
                        date(datetime({year: toInteger(split(t.return_date, '-')[2]), 
                        month: toInteger(split(t.return_date, '-')[1]), 
                        day: toInteger(split(t.return_date, '-')[0])})) >= date($firstdate)
                    )
    
            )

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
            count : count,
            firstdate : firstdate
        }
        const result = await driver.executeQuery(query, params);
        const response = parser.parse(result);
        // console.log(response.length);
        if (response.length === 0) {
            res.status(200).send({ message: "no transactions to show" });
        }
        else {
            console.log("count ",response.length);
            res.status(200).send(response);
        }
    } catch (error) {
        console.error('Something went wrong:', error);
    }
    // res.send("TODO :History returned successfully");
}

/*
AND date(datetime({year: toInteger(split(r.issue_date, '-')[2]), 
    month: toInteger(split(r.issue_date, '-')[1]), 
    day: toInteger(split(r.issue_date, '-')[0])})) > date($firstDate)

*/