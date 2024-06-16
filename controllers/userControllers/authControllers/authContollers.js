import driver from "../../../utils/neo4j-driver.js";
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

    const query = `CREATE (m:Member {
        library_card_string: $library_card_string,
        address: $address,
        join_date: $join_date,
        membership_id: $membership_id,
        sex: $sex,
        last_name: $last_name,
        phone_number: $phone_number,
        first_name: $first_name,
        email: $email,
        status: $status
        })
        RETURN m;`;

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
    const result = await driver.executeQuery(query, context);
    console.log(result);
    res.send(result).status(200);
  } catch (error) {
    res.send({ Error: error }).status(500);
  }
};
