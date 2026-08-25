import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import {connectDB} from "./config/db.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(cookieParser());
app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))

app.get("/", (req,res)=>{
    res.json({message : "Hello from server"});
})

//Database connection
connectDB()

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})