import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String, // Removed required: true so OAuth users can be created without a password
    },
    googleId: { // Added to track Google logins
      type: String,
    },
    githubId: { // Added to track GitHub logins
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = mongoose.model("User", UserSchema);