import express from "express";
import cors from "cors";
import "dotenv/config";
import job from "./lib/cron.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js"; 

import { connectDB } from "./lib/db.js";
import job from "./lib/cron.js";

const app = express();
const PORT = process.env.PORT || 3000;

//cron job
job.start();

// Add this middleware before your routes
app.use(express.json());
app.use(cors());


app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);

app.listen(3000, () => {
    console.log(`Server is running on ${PORT}`);
    connectDB();
});

