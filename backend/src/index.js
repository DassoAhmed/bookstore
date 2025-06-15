import express from "express";
import "dotenv/config"

import authRoutes from "./routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/api/auth",authRoutes);

console.log({ PORT })

app.listen(3000, () =>{
    console.log(`Server is running on ${PORT}`);
})
