import mongoose from "mongoose";
import { Profiler } from "react";

const userSchema = new mongoose.Schema({
  username:{
    type: String,
    required: true,
    unique: true
  },
  email:{
    type: String,
    required: true,
    unique: true
  },
  password:{
     type: String,
    required: true,
    unique: true,
    minlength: 6
  },
  ProfileImage:{
    type: String,
    default:""
  }
});

const User = mongoose.model("User", userSchema);

export default User;