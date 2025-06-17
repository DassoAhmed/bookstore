import express from "express";
import cloudinary from "../lib/cloudinary.js";
import Book from "../models/Book.js"; // Assuming you have a Book model defined
import { connectDB } from "../lib/db.js"; // Assuming you have a connectDB function to connect to MongoDB
import protectRoute from "../middleware/auth.middleware.js";

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

//pagination => infinite Scroll
router.get("/", protectRoute, async (req, res) => {
 // exa;ple call from react native - frontend
 // const response = await fetch ("http://localhost:3000/api/books?page=1&limit=5");
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip = (page - 1) * limit;

        const books = await Book.find()
        .sort({ createdAt: -1})// desc
        .skip(skip)
        .limit(limit)
        .populate("user", "username profileImage");

        const totalBooks = await Book.countDocuments();

        res.send({
            books,
            currentPage: page,
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
        });
    } catch (error) {
        console.log("Error in get all books route", error);
        res.status(500).json({message: "Internal server error"});
    }
})


export default router;