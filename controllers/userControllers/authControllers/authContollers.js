import driver from "../../../utils/neo4j-driver.js";
import parser from "parse-neo4j";
import { generateEtask } from "../../commonControllers/generateEtask.js";
import { sendEtaskToAdmin } from "../../../sockets/admin.js";
import {formatDate } from "../../../utils/formatDate.js";

export const addUserDetails = async (req, res) => {
  try {

    console.log(req.body);

    const {
      roll,
      dept,
      address,
      join_date,
      library_card_no,
      first_name,
      last_name,
      sex,
      phone_number,
      email,
      imageUrl,
    } = req.body;

    // generate library card string
    const library_card_count = process.env.MAX_LIBRARY_CARD_COUNT;
    const library_card_string = "0".repeat(library_card_count);

    console.log("library card string ", library_card_string);

    let status = "pending";


    const q = `
    MATCH (m:Member {membership_id: $membership_id}) 
    RETURN m`;
    const r = await driver.executeQuery(q, { membership_id: library_card_no });
    const response = parser.parse(r);
    
    if(response.length !== 0){
        status = response[0].status ? response[0].status : "pending";
    }

    const query = `MERGE (m:Member {membership_id: $membership_id})
    SET m.library_card_string=$library_card_string,
        m.roll = $roll,
        m.address = $address,
        m.join_date = $join_date,
        m.first_name = $first_name,
        m.last_name = $last_name,
        m.sex = $sex,
        m.phone_number = $phone_number,
        m.email = $email,
        m.status= $status,
        m.imageUrl = $imageUrl
    RETURN m`;

    const context = {
      roll: roll,
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
      imageUrl: imageUrl,
    };

    const result = await driver.executeQuery(query, context);
    const member = parser.parse(result);
    
    console.log("here");
    console.log(member);
    // for verification///////////////////////////
    const today = formatDate(new Date());

    const etaskObj = {
      title : "Account Verification",
      description : "For account verification of user",
      due_date : today,
      type : "account-verification",
      additional_details : {      
        first_name :member[0].first_name,
        last_name : member[0].last_name,
        roll : member[0].roll,
        join_date : member[0].join_date,
        lib_card_no : member[0].lib_card_no,
        email : member[0].email,
        phone_number : member[0].phone_number
      }
    }
    

    if(status === "pending"){
      const createdEtask = await generateEtask(etaskObj);
      sendEtaskToAdmin(etaskObj);
    }

    
    ///////////////////////////////////////
    
    console.log("there");

   
    if (response.length == 0) {
        const deptQuery = `MATCH (m:Member {membership_id: $membership_id}), 
                          (d:Department {dept_id : $dept})
                          CREATE (m)-[:ENROLLED_IN]->(d)
                          return m,d`;
        const deptContext = { membership_id: library_card_no, dept: dept };
        const deptRes = parser.parse(await driver.executeQuery(deptQuery, deptContext));

        if(deptRes.length === 0){
           res.status(500).send({message : "Server error"});
        }

        console.log("Success");
        res.send({ message: "Details added Successfully" }).status(200);
    } else {
      res.send({ message: "Details updated Successfully" }).status(200);
    }


    //1.generate etask for account verification and send it to admin

    


  } catch (error) {
    res.send({ message : error.message }).status(500);
  }
};
