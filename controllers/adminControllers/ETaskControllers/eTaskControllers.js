
import driver, { convertToNeo4jInteger } from "../../../utils/neo4j-driver.js";
import parser from "parse-neo4j";
import expressAsyncHandler from "express-async-handler";
import { generateEtask } from "../../commonControllers/generateEtask.js";

export const createETask = expressAsyncHandler( async (req, res) => {
    
    const obj1 = {
       title : "abc",
       description : "abcd",
       due_date : "12-12-2024",
       type : "account-verification",
       additional_details : {
           first_name : "arpan",
           last_name : "koley",
           roll : "002110111111",
           join_date : "12-08-2024",
           lib_card_no : "m_22222",
           email : "arpan@gmail.com",
           phone_number : "123456789" 
       }
    }

    const obj2 = {
      title : "abc",
      description : "abcd",
      due_date : "12-12-2024",
      type : "request-renenwal",
      additional_details :
        {
          id: '1177691302557384772',
          issue_date: '20-07-2024',
          lib_card_no: 3,
          due_date: '04-08-2024',
          renewal_count: 3,
          copy_no: 5,
          status: 'issued'
      }
   }

   try {
     const result = await generateEtask(req.body);
     res.status(200).send({message : "Etask created successfully"});      

   } catch (error) {
      res.status(error.code);
      throw error;
   }

});

export const getEtask = async (req, res) => {
  try {
    const query = `MATCH (e:ETask) RETURN e`;
    const response = parser.parse(await driver.executeQuery(query));
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({  message : "Server error" });
  }
};

export const getETaskCount = async (req, res) => {
  try {
    const query = `MATCH (e:ETask)
                   RETURN COUNT(e) AS count`;
    const result = parser.parse(await driver.executeQuery(query));
    console.log(result);
    if(result.length === 0){
      res.status(500);
      throw new Error("Server Error");
    }
    res.status(200).send({count : result[0]});
  } catch (error) {
    res.status(500).send({ message : "Server error" });
  }
};

export const deleteEtask = expressAsyncHandler(async(req,res)=>{
   const id = req.params.id;
   
   const query = `MATCH (e:ETask)
                 WHERE id(e) = $id
                 DELETE e
                 RETURN TRUE`;

   const result = parser.parse(await driver.executeQuery(query,{id : convertToNeo4jInteger(id)}));
   console.log(result);
   if(result.length === 0){
      res.status(500);
      throw new Error("Server Error");
   }

   res.status(200).send({message : 'Etask deleted successfully'});

})
