import driver from "../../../utils/neo4j-driver.js";

export const reserveBook = async (req, res) => {
    res.status(200).send({ message : "reserve book api controller"});
}

export const wishlistBook = async (req, res) => {
    res.status(200).send({ message : "wishlist book api controller"});
}
