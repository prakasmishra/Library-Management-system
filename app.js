import express from "express";
import connectToDB from "./db/connectToDB.js";
import cors from "cors";

import checkRoutes from "./routes/checkRoutes.js";

import adminRoutes from "./routes/adminRoutes/adminRoutes.js";
import commonRoutes from "./routes/commonRoutes/commonRoutes.js";

import myBooksRoutes from "./routes/userRoutes/myBooks/myBooksRoutes.js";
import booksRoutes from "./routes/userRoutes/books/booksRoutes.js";
import profileRoutes from "./routes/userRoutes/profileRoutes/profile.js";
import addDetailsRoutes from "./routes/userRoutes/authentication/auth.js";
import { errorHandler, notFound } from "./middlewares/errorMiddleware.js";

const app = express();
app.use(cors());

const PORT = process.env.PORT;

app.use(express.json());

// Routes
app.use("/api/developer", checkRoutes);

// user

app.use("/api/user/myBooks", myBooksRoutes);
app.use("/api/user/books", booksRoutes);
app.use("/api/user/profile", profileRoutes);
app.use("/api/user/auth", addDetailsRoutes);
//user/book/browse

// admin
app.use("/api/admin", adminRoutes);

// common for search books
app.use("/api/common", commonRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  connectToDB();
  const d = new Date();
  console.log(`Server listening on port http://localhost:${PORT} on ${d}`);
});