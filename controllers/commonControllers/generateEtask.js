import driver, { convertToNeo4jInteger } from  "../../utils/neo4j-driver.js";
import parser from "parse-neo4j";
import expressAsyncHandler from "express-async-handler";

export const generateEtask = expressAsyncHandler(async(etaskObj) => {
  
    console.log("Got ",etaskObj);
  
    let query;
  
    if(etaskObj.type === "account-verification"){
      query = `
      CREATE (e:ETask {
       title: $title,
       description: $description,
       due_date: $due_date,
       type: $type,
       account_first_name: $additional_details.first_name,
       account_last_name: $additional_details.last_name,
       account_roll: $additional_details.roll,
       account_join_date: $additional_details.join_date,
       account_lib_card_no: $additional_details.lib_card_no,
       account_email: $additional_details.email,
       account_phone_number: $additional_details.phone_number
       })
       RETURN e
       `;
  
       
    }
  
    else if(etaskObj.type === "request-renenwal"){
       query = `
         CREATE (e:ETask {
         title: $title,
         description: $description,
         due_date: $due_date,
         type: $type,
         transaction_id: $additional_details.id,
         transaction_issue_date: $additional_details.issue_date,
         transaction_lib_card_no: $additional_details.lib_card_no,
         transaction_due_date: $additional_details.due_date,
         transaction_renewal_count: $additional_details.renewal_count,
         transaction_copy_no: $additional_details.copy_no,
         transaction_status: $additional_details.status
         })
         RETURN e
       `;
    }
    else{
      const e = new Error("Wrong type provided");
      e.code = 400;
      throw e;
    }
  
    const result = parser.parse(await driver.executeQuery(query, etaskObj));
  
     if(result.length === 0){
        const e = new Error("Server error,cannot create etask");
        e.code = 500;
        throw e;
     }     
     return result[0];
  })