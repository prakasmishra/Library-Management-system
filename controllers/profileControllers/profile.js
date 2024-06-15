import driver from "../../utils/neo4j-driver.js";

export const profileHome = async (req, res) => {
  const id = req.params.id;
  console.log(id);
  try {
    const result = await driver.executeQuery(
      `MATCH (m:Member {membership_id : $id}) return m`,
      { id: id }
    );
    console.log(result.records.at(0)._fields.at(0).properties);
    // member_details = result.records.at(0)._fields.at(0).properties;
    res.send(result.records.at(0)._fields.at(0).properties).status(200);
  } catch (error) {
    console.log("Error at extracting data");
    res.send({ message: "Error in extracting" }).status(400);
  }
};
