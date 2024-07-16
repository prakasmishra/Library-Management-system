import driver from "../../../utils/neo4j-driver.js"

import asyncHandler from "express-async-handler"

import parser from 'parse-neo4j';

// for updating general info
export const verifyMember = asyncHandler(async(req,res) => {

  const id = req.params.id;  
  console.log("member_id : ", id);

  const queryMember = `MATCH (member:Member {membership_id : $member_id})
                  RETURN member
    `;

  const resultMember = parser.parse(
    await driver.executeQuery(queryMember, { member_id: id })
  );
  if (resultMember.length === 0) {
    res.status(404);
    throw new Error("Member does not exists.");
  }

//   console.log(resultMember);

  const query = `MATCH (member:Member {membership_id : $member_id})
                 SET member.status = 'active'
                 RETURN member 
    `;

  const result = parser.parse(
    await driver.executeQuery(query, { member_id: id })
  );

  if(result.length === 0){
    res.status(500);
    throw new Error("Server error");
  }

    console.log(result[0]);

    res.status(200).send({ message : "member status updated successfully"});
})