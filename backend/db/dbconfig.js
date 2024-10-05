import dotenv from "dotenv";
import mongoose from "mongoose";


dotenv.config()// to up and running the env file 


export const connectDb = async ()=>{

    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(conn.connection.host)

    }catch(err){
        console.log(err)
        process.exit(1);// 1 means success and 0 means failure
    }

}