import mongoose from "mongoose";
import { errorHandler } from "../middleware/errorHandler.js";

export const connectDB = async () => {
    try {
            await mongoose.connect(process.env.CONNECTION_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })        
    } catch (error) {
        errorHandler(error);
        console.log(`Database Connection failed`)
    }
}