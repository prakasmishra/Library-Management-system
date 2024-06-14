import express from "express";
import connectToDB from "./db/connectToDB.js";

import checkRoutes from "./routes/checkRoutes.js";

const app = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/developer", checkRoutes);

app.listen(PORT, () => {
    connectToDB();
    console.log(`Server listening on port http://localhost:${PORT}`);
});