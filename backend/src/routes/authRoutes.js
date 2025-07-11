import express, { Router } from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import bcrypt from "bcryptjs"; 



const router = express.Router();

const generateToken = (userId) => {
  return jwt.sign({userId}, process.env.JWT_SECRET, {expiresIn: "15d"});
  };

router.post("/register", async (req, res) => {
    try{
        const { email, username, password } = req.body;

        if(!username || !email || !password) {
            return res.status(400).json({ message: "|All fields are required"});
        }

        if(password.length < 6){
            return res.status(400).json({ message: "Password must be at least 6 characters long"}); 
        }

        if(username.length < 3){
             return res.status(400).json({ message: "Username should be at least 3 characters long"});
        }

        // //check if user already exists
        const existingEmail = await User.findOne({ email});
        if(existingEmail) {
            return res.status(400).json({ message: "Email already exists"});
        }

        const existingUsername = await User.findOne({ username});
        if(existingUsername) {
            return res.status(400).json({ message: "Username already exists"});
        }
         
        //get radom avatar
        const randomAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

        // create new user
        const user = User({
            email,
            username,
            password,
            profileImage,
            createdAt: user.createdAt,
        });

        // save user to database
        await user.save();

         // generate token and send to client
        const token = generateToken(user._id);

        res.status(201).json({
           token,
           user: { 
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
        },    
        });      
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Internal server error" });
    } 
});

router.post("/login", async (req, res) => {
 try{
    const { email, password } = req.body;

    if(!email || !password) return res.status(400).json({ message: "All fields are required"});
    
    //check if user exists
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ message: "Invalid credentials"});

    //check if password is correct 
    const isPasswordValid = await user.comparePassword(password);
    if(!isPasswordValid) return res.status(400).json({ message: "Invalid credentials"});
  
    //generate token and send to client
    const token = generateToken(user._id);

    res.status(200).json({
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            profileImage: user.profileImage,
            createdAt: user.createdAt,
        },
    }); 
 }catch (error){
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "Internal server error" });
 }
});

export default router;