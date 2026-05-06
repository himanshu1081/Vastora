import connectDB from "./db/index.js";
import dotenv from "dotenv";
import app from './app.js'

dotenv.config({
  path: "./env"
})


const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on ${PORT}`);
    });
  });