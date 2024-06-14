import neo4j from "neo4j-driver";

const connectToDB = async () => {
    let driver = neo4j.driver(process.env.NEO4J_URI, neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD));
    try {
        const serverInfo = await driver.getServerInfo();
        console.log('Connection estabilished');
        console.log(serverInfo);
    } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`);
        await driver.close();
        return;
    }
};

export default connectToDB;