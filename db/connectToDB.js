import driver from "../utils/neo4j-driver.js"

const connectToDB = async () => {
    try {
        const serverInfo = await driver.getServerInfo()
        console.log('Connection estabilished');
        console.log(serverInfo);
    } catch (err) {
        console.log(`Connection error\n${err}\nCause: ${err.cause}`);
        await driver.close();
        return;
    }
};

export default connectToDB;