import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from './app.js'

dotenv.config({
  path: "./env"
})


connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`🚀 Server is running`);
    });
  })
