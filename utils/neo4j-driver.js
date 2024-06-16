// neo4jDriver.js
import neo4j from "neo4j-driver";
import dotenv from "dotenv";

dotenv.config();

// Configuration details for Neo4j
const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

// Create a driver instance
const driver = neo4j.driver(
  NEO4J_URI,
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD)
);

// Export the driver
export default driver;


// Export Neo4j Integer conversion method
export const convertToNeo4jInteger = (x) => {
    return neo4j.int(x);
}
