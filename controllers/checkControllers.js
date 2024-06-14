import driver from "../utils/neo4j-driver.js"

export const check = async (req, res) => {
    const result = await driver.executeQuery(`
    MATCH (b:Book) RETURN b;
    `, {}
    )
    for (let book of result.records) {
        console.log(book.get('b'));
    }
    res.send("Fetched");
}