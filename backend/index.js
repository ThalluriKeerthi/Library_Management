import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import cookieParser from "cookie-parser";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"
import bookroutes from "./routes/book.routes.js"
import borrowRoutes from "./routes/borrow.routes.js"
import adminRoutes from "./routes/admin.routes.js"
import {connectCloudinary} from "./config/cloudinary.js";

const app = express();

app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}))

app.use(cookieParser())

app.use(express.json());

app.use(express.urlencoded({extended : true}));

app.get("/api", (req,res)=>{
    res.json({message : "Hello from server"});
})

//Database connection
connectDB()

//Cloudinary connection
connectCloudinary()

//Routes
app.use("/api/auth", authRoutes)
app.use("/api/books", bookroutes)
app.use("/api/borrow", borrowRoutes)
app.use("/api/admin", adminRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT,()=>{
    console.log(`server is running on ${PORT}`);
})