import axios from "axios";
import driver from "../../../utils/neo4j-driver.js";
import parser from "parse-neo4j";
import asyncHandler from "express-async-handler";

export const profileHome = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const context = {
      id: id,
    };
    const memberQuery = `MATCH (m:Member {membership_id : $id}) return m`;
    const deptQuery = `MATCH (m:Member{membership_id : $id})-[:ENROLLED_IN] ->(d:Department) RETURN d`;
    const res1 = await driver.executeQuery(memberQuery, context);
    const res2 = await driver.executeQuery(deptQuery, context);
    const res3 = await axios.get(
      `https://library-management-system-f9gh.onrender.com/api/user/profile/get/fav-sub/${id}`
    );
    const memberDetails = parser.parse(res1);
    const deptDetails = parser.parse(res2);
    // console.log(memberDetails[0]);
    // console.log(deptDetails[0]);
    console.log(res3.data);
    const profile = {
      member: memberDetails[0],
      department: deptDetails[0],
      favSub: res3.data,
    };
    console.log("Success");
    // member_details = result.records.at(0)._fields.at(0).properties;
    res.send(profile).status(200);
  } catch (error) {
    console.log("Error at extracting data");
    res.send({ message: error }).status(500);
  }
};

export const getFavSub = async (req, res) => {
  try {
    const memberId = req.params.id;
    const query = `MATCH (m:Member {membership_id: $membership_id})-[r:FAVSUBJECT]->(s:Subject)
  return s`;
    const context = { membership_id: memberId };
    const result = await driver.executeQuery(query, context);
    const subjects = result.records.map(
      (record) => record.get("s").properties.sub_name
    );
    console.log(subjects);
    res.status(200).send(subjects);
  } catch (error) {
    res.status(500).send({ Error: error });
  }
};

export const removeFavSub = async (req, res) => {
  try {
    const memberId = req.params.id;
    const { sub_name } = req.body;
    //---------------------------------Checking For Relation----------------------------------------------------------------------------
    const checkQuery = `
      MATCH (m:Member {membership_id: $membership_id})-[r:FAVSUBJECT]->(s:Subject {sub_name: $sub_name})
      RETURN count(r) AS relationshipCount;
    `;
    const checkContext = {
      membership_id: memberId,
      sub_name: sub_name,
    };
    const checkResult = await driver.executeQuery(checkQuery, checkContext);

    const relationshipCount = checkResult.records[0].get("relationshipCount");
    //-------------------------------If Exists then Deleting-----------------------------------------------------------------------------
    if (relationshipCount > 0) {
      const deleteQuery = `MATCH (m:Member {membership_id: $membership_id})-[r:FAVSUBJECT]->(s:Subject {sub_name: $sub_name})
  Delete r
`;
      const deleteContext = { membership_id: memberId, sub_name: sub_name };
      const result = await driver.executeQuery(deleteQuery, deleteContext);
      console.log("Success");
      res.status(200).send({ message: "Entry Deleted Successfully" });
    }
    res.status(500).send({ message: "No Such Record Exists" });
  } catch (error) {
    res.status(500).send({ Error: error });
  }
};

export const addFavSub = asyncHandler(async (req, res) => {
  try {
    const memberId = req.params.id;
    const newList = req.body.sub_list;
    const removedSub = [];
    // Validating the member ----------------------------------------------------------------
    const memberCheckQuery = `MATCH (n:Member {membership_id : $memberId}) RETURN n`;
    const result1 = parser.parse(
      await driver.executeQuery(memberCheckQuery, { memberId: memberId })
    );
    if (result1.length === 0) {
      res.status(404).send("Not a valid Member");
      throw new Error("Member does not exists.");
    }

    const currFavSubCall = await axios.get(
      `https://library-management-system-f9gh.onrender.com/api/user/profile/get/fav-sub/${memberId}`
    );
    const currFavSub = currFavSubCall.data;
    for (const oldSub of currFavSub) {
      const index = newList.indexOf(oldSub);
      if (index === -1) {
        console.log("sub : ", oldSub);
        removedSub.push(oldSub);
      } else {
        newList.splice(index, 1);
      }
    }
    console.log("removeFavSub : ", removedSub);
    console.log("newList : ", newList);
    const createQuery = `
                MATCH (s:Subject {sub_name : $sub_name})
                MATCH (m:Member {membership_id : $memberId})
                CREATE (m)-[r:FAVSUBJECT {}]->(s)
                RETURN r,m,s`;

    for (const sub of newList) {
      try {
        const result = await driver.executeQuery(createQuery, {
          sub_name: sub,
          memberId: memberId,
        });
      } catch (error) {
        res.status(500).send({ error: error });
      }
    }

    const deleteQuery = `MATCH (m:Member {membership_id: $memberId})-[r:FAVSUBJECT]->(s:Subject {sub_name: $sub_name})
  Delete r`;
    for (const sub of removedSub) {
      try {
        const result = await driver.executeQuery(deleteQuery, {
          sub_name: sub,
          memberId: memberId,
        });
      } catch (error) {
        res.status(500).send({ error: error });
      }
    }

    const newFavSub = await axios.get(
      `https://library-management-system-f9gh.onrender.com/api/user/profile/get/fav-sub/${memberId}`
    );

    console.log("New Fav : ", newFavSub.data);

    res.status(200).send("Update Successful");
  } catch (error) {
    res.status(500).send({ error: error });
  }
});

export const getLibraryCardInfo = asyncHandler(async (req, res) => {
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

  console.log(resultMember);

  const query = `MATCH (member:Member {membership_id : $member_id})-
                  [transaction:TRANSACTION {status : 'issued'}]->
                  (book:Book),
                  (author:Author)-[:WROTE]->(book)
                  RETURN transaction,book.title as book_title, author.author_name as author_name
    `;

  const result = parser.parse(
    await driver.executeQuery(query, { member_id: id })
  );

  console.log("tx array ", result);

  const lib_card_string = resultMember[0].library_card_string;
  console.log("card string : ", lib_card_string);

  var responseArray = result.map((obj) => {
    const responseObj = {
      library_card_no: obj.transaction.lib_card_no,
      status: "occupied",
      issue_date: obj.transaction.issue_date,
      due_date: obj.transaction.due_date,
      book_title: obj.book_title,
      author_name: obj.author_name,
    };
    return responseObj;
  });

  for (var i = 0; i < lib_card_string.length; i++) {
    if (lib_card_string[i] === "0") {
      responseArray.push({
        library_card_no: i + 1,
        status: "available",
      });
    }
  }

  res.send(responseArray);
});
