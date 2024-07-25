import expressAsyncHandler from "express-async-handler";
import driver from "../../../utils/neo4j-driver.js";
import parser from "parse-neo4j";

export const checkStatusActive = expressAsyncHandler (async (req, res, next) => {
    const memberId = req.params.memberId;
    const helperQuery = `
        MATCH (member:Member {membership_id: $member_id, status : 'active'})
        RETURN member`;

    const helperParams = {
      member_id: memberId,
    };
    const helperResult = await driver.executeQuery(helperQuery, helperParams);
    const response = parser.parse(helperResult);

    console.log(response);

    if(response.length === 0){
        res.status(400);
        throw new Error("Member status is not activated. Ask admin");
    }
    next();
});
