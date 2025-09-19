// backend/src/db/utils.js
import mongoose from "mongoose";
import { settings } from "../config.js";

export async function getMongoClient() {
  try {
    const conn = await mongoose.connect(settings.MONGO_DB_URL, {
      dbName: settings.MONGO_DB_DB,
    });
    console.log("✅ MongoDB connected");
    return conn.connection;
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}
