const TTL = 5;
import driver from "../../../utils/neo4j-driver.js";
import ShortUniqueId from "short-unique-id";
import parser from "parse-neo4j";
import { query } from "express";

export const createTask = async (req, res) => {
  try {
    const { randomUUID } = new ShortUniqueId({ length: 8 });
    const id = randomUUID();
    console.log(id);
    const { task_body, type, time_stamp } = req.body;
    // const [day, month, year] = time_stamp.split("-").map(Number);
    const query = `CREATE (e:ETask {
                        id : $id,
                        task_body: $task_body,
                        type: $type,
                        read: FALSE,
                        ttl: $ttl,
                        time_stamp : $time_stamp}) return e`;

    const context = {
      id: id,
      task_body: task_body,
      type: type,
      time_stamp: time_stamp,
      ttl: TTL,
    };
    console.log(context);
    const result = await driver.executeQuery(query, context);
    res.status(200).send("Success");
  } catch (error) {
    res.status(500).send({ Server_Error: error });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const query = ` MATCH (e:ETask {id :$id})
                  SET e.read = TRUE
                  RETURN e`;
    const response = parser.parse(await driver.executeQuery(query, { id: id }));
    console.log(response[0]);
    res.status(200).send("Task Read");
  } catch (error) {
    res.status(500).send({ Server_Error: error });
  }
};
export const getTask = async (req, res) => {
  try {
    const query = `match (e:ETask {read : FALSE}) return e`;
    const response = parser.parse(await driver.executeQuery(query, {}));
    res.status(200).send(response);
  } catch (error) {
    res.status(500).send({ Server_Error: error });
  }
};
export const getTaskCount = async (req, res) => {
  try {
    const query = `MATCH (e:ETask {read: false})
                  RETURN COUNT(e) AS count`;
    const response = parser.parse(await driver.executeQuery(query, {}));
    const result = "" + response[0];
    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ Server_Error: error });
  }
};