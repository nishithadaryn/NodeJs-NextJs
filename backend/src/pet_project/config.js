// backend/src/config.js
import dotenv from "dotenv";

dotenv.config(); // loads .env file

export const settings = {
  // MongoDB
  MONGO_DB_URL: process.env.APP_MONGO_DB_URL,
  MONGO_DB_DB: process.env.APP_MONGO_DB_DB,
  
  // CORS
  ALLOWED_ORIGINS: process.env.APP_ALLOWED_ORIGINS
    ? process.env.APP_ALLOWED_ORIGINS.split(",")
    : ["*"],
};
