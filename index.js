// Libs
import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

// Route
import authRoute from "./src/routes/auth.js";

const app = express();
const port = process.env.PORT || 8000;
const corsOptions = {
  origin: true,
  credentials: true,
};

// Database connection
mongoose.set("strictQuery", false);
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

    console.log("MongoDB database connected!");
  } catch (error) {
    console.log("MongoDB database connection failed!");
  }
};

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

// Apis
app.use("/api/v1/auth", authRoute);

app.listen(port, () => {
  connect();
  console.log("Server running on port", port);
});
