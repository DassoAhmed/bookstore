import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js"; // Assuming you have a Book model defined
import { connectDB } from "../lib/db.js"; // Assuming you have a connectDB function to connect to MongoDB


const router = express.Router();

// create a new book
router.post("/", protectRoute, async (req, res) => {
    try {
        const { title, caption, rating, image } = req.body;
        // Validate required fields
        if (!title || !caption || !rating || !image) {
            return res.status(400).json({ message: "kindly provide all fields." });
        }

        // upload image to cloudinary
        const uploadedImage = await cloudinary.uploader.upload(image);
        const imageUrl = uploadedImage.secure_url; 

        //save to mongoDB
        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            userId: req.user._id, // Assuming req.user is set by authentication middleware
        });
         
        await newBook.save();
        res.status(201).json(newBook);

    } catch (error) {
        console.error("Error creating book:", error);
        res.status(500).json({ message: error.message });
    }
}); 


export default router;