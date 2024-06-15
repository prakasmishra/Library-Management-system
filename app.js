import express from "express";
import connectToDB from "./db/connectToDB.js";

import checkRoutes from "./routes/checkRoutes.js";
import adminRoutes from "./routes/adminRoutes/adminRoutes.js";
import commonRoutes from "./routes/commonRoutes/commonRoutes.js";


const app = express();

const PORT = process.env.PORT;

app.use(express.json());


// Routes
app.use("/api/developer", checkRoutes);

app.use("/api/admin",adminRoutes);
app.use("/api/common",commonRoutes);


app.listen(PORT, () => {
    connectToDB();
    console.log(`Server listening on port http://localhost:${PORT}`);
});