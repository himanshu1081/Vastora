import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log("Connceted to database!!");
    } catch (e) {
        console.log("Conncetion Failed Error: ", e);
        throw e;
        process.exit(1);
    }
}

export default connectDB