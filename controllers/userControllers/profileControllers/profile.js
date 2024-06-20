import axios from "axios";
import driver from "../../../utils/neo4j-driver.js";
import parser from "parse-neo4j";

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
      `http://127.0.0.1:3000/api/user/profile/get/fav-sub/${id}`
    );
    const memberDetails = parser.parse(res1);
    const deptDetails = parser.parse(res2);
    // console.log(memberDetails[0]);
    // console.log(deptDetails[0]);
    // console.log(res3.data);
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

export const addFavSub = async (req, res) => {
  try {
    const memberId = req.params.id;
    const { sub_name } = req.body;
    const query = `MATCH (s:Subject {sub_name : $sub_name})
                MATCH (m:Member {membership_id : $member_id})
                CREATE (m)-[r:FAVSUBJECT {}]->(s)
                RETURN r,m,s`;
    const context = {
      sub_name: sub_name,
      member_id: memberId,
    };
    const result = await driver.executeQuery(query, context);
    let toSend = [];
    toSend.push(result.records[0].get("m").properties);
    // toSend.push(result.records[0].get("r").properties);
    toSend.push(result.records[0].get("s").properties);
    console.log(toSend);
    res.status(200).send(toSend);
  } catch (error) {
    res.status(500).send({ Error: error });
  }
};
