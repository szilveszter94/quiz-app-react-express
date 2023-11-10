import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import quizRouter from "./routes/quiz.routes.js";

dotenv.config();

const username = process.env.MONGO_USER;
const password = process.env.MONGO_PASSWORD;
const mongoString = process.env.MONGO_STRING;
const MONGO_URL = `mongodb+srv://${username}:${password}@cluster0.${mongoString}.mongodb.net/quizzy?retryWrites=true&w=majority`;

const app = express();
const PORT = 3000;
mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URL);

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,PUT,PATCH,POST,DELETE",
  })
);

app.use("/api/v2/quiz", quizRouter);

app.listen(PORT, () => {
  console.log("Server started at http://localhost:3000");
});
