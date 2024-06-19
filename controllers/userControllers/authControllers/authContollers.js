import driver from "../../../utils/neo4j-driver.js";
import parser from "parse-neo4j";

export const addUserDetails = async (req, res) => {
  try {
    const {
      address,
      join_date,
      library_card_no,
      first_name,
      last_name,
      sex,
      phone_number,
      email,
    } = req.body;
    const library_card_string = "000";
    const status = "pending";
    const q=`
    MATCH (m:Member {membership_id: $membership_id}) 
    RETURN m.membership_id as id`;
    const r=  await driver.executeQuery(q, {membership_id:library_card_no});
    const response = parser.parse(r);
    const query = `MERGE (m:Member {membership_id: $membership_id})
    SET m.library_card_string=$library_card_string,
        m.address = $address,
        m.join_date = $join_date,
        m.first_name = $first_name,
        m.last_name = $last_name,
        m.sex = $sex,
        m.phone_number = $phone_number,
        m.email = $email,
        m.status= $status
    RETURN m`;

    const context = {
      membership_id: library_card_no,
      first_name: first_name,
      last_name: last_name,
      email: email,
      phone_number: phone_number,
      status: status,
      library_card_string: library_card_string,
      address: address,
      sex: sex,
      join_date: join_date,
    };
    console.log("hello");
    const result = await driver.executeQuery(query, context);
    // console.log(result);
    console.log(result.records[0].get("m").properties);
    if(response.length==0){
      res.send({ message: "Details added Successfully" }).status(200);
    }
    else{
      res.send({ message: "Details updated Successfully" }).status(200);
    }
  } catch (error) {
    res.send({ Error: error }).status(500);
  }
};
