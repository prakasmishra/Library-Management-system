import express from "express";
import dotenv from "dotenv";
import connectToDB from "./db/connectToDB.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT;

app.use(express.json());

app.listen(PORT, () => {
    connectToDB();
    console.log(`Server listening on port http://localhost:${PORT}`);
});