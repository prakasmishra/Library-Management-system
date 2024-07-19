import driver from "../../../utils/neo4j-driver.js";
import parser from "parse-neo4j";

export const updateAdminDetails = async (req, res) => {
  try {
    const { emp_id, dept, name, phone_number, email } = req.body;

    const q = `
    MATCH (a:Admin {id: $emp_id}) 
    RETURN a.id as id`;
    const r = await driver.executeQuery(q, { emp_id: emp_id });
    const response = parser.parse(r);
    console.log(response);

    const query = `MERGE (m:Admin {id: $emp_id})
    SET
        m.name = $name,
        m.phone_number = $phone_number,
        m.email = $email
    RETURN m`;

    const context = {
      emp_id: emp_id,
      name: name,
      email: email,
      phone_number: phone_number,
    };
    const result = await driver.executeQuery(query, context);
    const member = parser.parse(result);
    console.log(member);
    console.log(result);
    if (response.length == 0) {
      const deptQuery = `MATCH (m:Admin {id: $emp_id}), 
                        (d:Department {dept_id : $dept})
                        CREATE (m)-[:AdminOf]->(d)
                        return m,d`;
      const deptContext = { emp_id: emp_id, dept: dept };
      const deptRes = await driver.executeQuery(deptQuery, deptContext);
      console.log("Success");
      res.send({ message: "Details added Successfully" }).status(200);
    } else {
      res.send({ message: "Details updated Successfully" }).status(200);
    }
  } catch (error) {
    res.send({ Error: error }).status(500);
  }
};

export const getAdminDetails = async (req, res) => {
  const emp_id = req.params.emp_id;
  console.log(emp_id);
  try {
    const memberQuery = `MATCH (m:Admin {id : $id}) return m`;
    const deptQuery = `MATCH (m:Admin{id : $id})-[:AdminOf] ->(d:Department) RETURN d`;
    const res1 = await driver.executeQuery(memberQuery, { id: emp_id });
    const res2 = await driver.executeQuery(deptQuery, { id: emp_id });
    const adminDetails = parser.parse(res1);
    if (adminDetails.length === 0) {
      res.status(400).json({
        Error: "Not a valid User",
      });
      return;
    }
    const deptDetails = parser.parse(res2);
    const profile = {
      admin: adminDetails[0],
      department: deptDetails[0],
    };
    console.log("Success");
    res.send(profile).status(200);
  } catch (error) {
    console.log("Error at extracting data");
    res.send({ message: error }).status(500);
  }
};
