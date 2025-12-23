import express from "express";
import dotenv from 'dotenv';
import mongoose from "mongoose";
import uploadRoutes from "./Routes/uploadRoutes.js";
import cors from "cors"



const app = express();   
app.use(express.json());
dotenv.config();

const port = process.env.PORT;
const mongodb = process.env.MONGODB;

app.use(cors());
app.use(express.json());

app.use("/", uploadRoutes);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });