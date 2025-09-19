// backend/src/app.js
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import apiRouter from "./api/routes/index.js"; // similar to your api/views.py
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  credentials: true,
}));

// MongoDB setup
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
}
connectDB();

// Routes
app.use("/api", apiRouter);

// Root endpoint
app.get("/", (req, res) => {
  res.json({ Hello: "pet project world" });
});

export default app;
