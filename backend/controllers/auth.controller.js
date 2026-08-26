import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

//cookie options 
const cookieOptions = {
    httpOnly : true,
    secure : false,
    sameSite : "strict",
    maxAge : 7 * 24* 60 * 60 * 1000
}

//STUDENT REGISTER

export const registerStudent = async (req, res) => {
    try {
        const {name, email, password} = req.body;
        if(!name || !email || !password) {
            return res.json({success : false, message : "All fields are required"});
        }

        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.json({success : false, message : "student already exists with this email"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name, 
            email,
            password : hashedPassword,
            role : "student"
        })

        const token = generateToken({
            id : user._id,
            role : user.role
        })

        res.cookie("token", token, cookieOptions);

        return res.json({
            success : true,
            message : "student registered",
            user : {
                id : user._id,
                name : user.name,
                email : user.email,
                role : user.role
            }
        }) 
    } catch(err) {
        return res.json({message : "Internal server error", error});
    }
}


