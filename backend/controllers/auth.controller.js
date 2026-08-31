import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import crypto from "crypto";
import {sendEmail} from "../utils/sendEmails.js";

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


//LOGIN (ADMIN + STUDENT)
export const loginUser = async(req, res) => {
    try{
        const {email, password} = req.body;
        if(!email || !password) {
            return res.json({success : false, message : "All fields are required"});
        }

        //Admin login from .env

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = generateToken({
                email : process.env.ADMIN_EMAIL,
                role : admin
            });
            res.cookie("token", token, cookieOptions);

            return res.json({
                success : true,
                message : "Admin login successful",
                user : {
                    email : process.env.ADMIN_EMAIL,
                    role : "admin"
                }
            }) 
        }

        //Student login from DataBase

        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({
                success : false,
                message : "User not  Registered"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({
                success : false,
                message : "Invalid password"
            });
        }

        const token = generateToken({
                id : user._id,
                role : user.role
        });
        res.cookie("token", token, cookieOptions);

        return res.json({
            success : true,
            message : "Student login successful",
            user : {
                id : user.id,
                name : user.name,
                email : user.email,
                role : user.role
            }
        }) 

    }catch(err) {
        return res.json({message : "Internal server error", error});
    }
}

//LOGOUT 

export const logoutUser = async(req, res) => {
    try{
        res.cookie("token", "",{
            httpOnly : true,
            expires : new Date(0)
        })
        return res.status(200).json({
            success : true,
            message : "Logged out successfully"
        });
    } catch(error) {
         return res.json({message : "Internal server error", error});
    }
} 

//GET MY PROFILE API
export const getMyProfile = async(req, res) => {
    try{
        
        if(req.user.role === "Admin") {
            return res.status(200).json({
            success : true,
            message : "Logged out successfully"
                })
        };    

        const {id} = req.user;
        const user = await User.findById(id).select("-password");
        return res.status(200).json({
            success : true,
            user
        });
    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Failed to fetch profile",
            error : error.message
        });
    }
}

export const forgotPassword = async(req, res) => {
    try{
        const {email} = req.body;

        if(!email) {
           return res.status(400).json({
                success : false,
                message : "Email is Required",
        })
        }
        const user = await User.findOne({email});
        if(!user) {
            return res.status(404).json({
                success : false,
                message : "User Not Found",
            })
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        //hash token and save in DB
        const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; //15 minutes

        await user.save({validateBeforeSave : false});
        //create reset URL

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const message = `Password Reset Request 
          click the link below to reset your password ${resetURL}
          This link will expire in 15 minutes
          If you did not request this , please ignore this email.`;

        try {
            await sendEmail({
                email : user.email,
                subject : "Password Reset",
                message : message
            })
            return res.status(200).json({
                success : true,
                message : "Reset Password Email sent"
            })
        } catch(error) {
            return res.status(500).json({
                success : false,
                message : "Email could not be sent"
            })
        }

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Interval Server Error",
            error : error.message
        })
    }
}
