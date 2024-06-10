import express from "express";
import dotenv from "dotenv";
import neo4j from "neo4j-driver";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const NEO4J_URI = process.env.NEO4J_URI;
const NEO4J_USERNAME = process.env.NEO4J_USERNAME;
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD;

let people = [{ name: 'Alice', age: 42, friends: ['Bob', 'Peter', 'Anna'] },
{ name: 'Bob', age: 19 },
{ name: 'Peter', age: 50 },
{ name: 'Anna', age: 30 }]

let driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

(async () => {
    try {
        const serverInfo = await driver.getServerInfo()
        console.log('Connection estabilished')
        console.log(serverInfo)
    } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`)
        await driver.close()
        return
    }
})();


// let session = driver.session();

app.post('/createNodes', async (req, res) => {
    for (let person of people) {
        await driver.executeQuery(
            'MERGE (p:Person {name: $person.name, age: $person.age})',
            { person: person }
        )
    }
    console.log("Created...");
});

app.post('/createRelationships', async (req, res) => {
    try {
        for (let person of people) {
            if (person.friends != undefined) {
                await driver.executeQuery(`
                MATCH (p:Person {name: $person.name})
                UNWIND $person.friends AS friendName
                MATCH (friend:Person {name: friendName})
                MERGE (p)-[:KNOWS]->(friend)
                `, { person: person }
                )
            }
        }
    }
    catch (error) {
        console.error('An error occurred:', error.message);
    }
    console.log("Created...");
});


app.get('/getFriends', async (req, res) => {
    const result = await driver.executeQuery(`
    MATCH (p:Person {name: $name})-[:KNOWS]-(friend:Person)
    WHERE friend.age < $age
    RETURN friend
    `, { name: 'Alice', age: 40 },
    { database: 'neo4j' }
  )

  // Loop through results and do something with them
  for(let person of result.records) {
    // `person.friend` is an object of type `Node`
    console.log(person.get('friend'))
  }
});


app.listen(PORT, () => {
    console.log(`Server listening on port http://localhost:${PORT}`);
});