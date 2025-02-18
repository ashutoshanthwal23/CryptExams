import mongoose from "mongoose"
import { config } from "./config.js"

const connectDB = async () => {
    try{
        mongoose.connection.on("connected", () => {
            console.log("Connected to database successfully");
        })

        mongoose.connection.on("error", (err) => {
            console.log("Error connecting to database", err);
        })

        await mongoose.connect(config.databaseUrl);

    } catch(err){
        console.log(err);
        process.exit(1);
    }
}

export default connectDB;