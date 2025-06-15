import express from "express";
import "dotenv/config";

import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./lib/db.js";

const app = express();
// Add this middleware before your routes
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/api/auth",authRoutes);

app.listen(3000, () => {
    console.log(`Server is running on ${PORT}`);
    connectDB();
});
