import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { EmployeeModel } from './models/Employee.js';

// Initialize environment variables from .env
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
// Connect strictly to MongoDB Atlas and force the database name
mongoose.connect(process.env.MONGO_URI, {
    dbName: 'DocuMind' // <--- This forces Mongoose to use DocuMind, ignoring the 'test' default
})
  .then(() => console.log("✅ Connected to MongoDB Atlas successfully!"))
  .catch(err => console.error("❌ Database connection error: ", err));
// --- ROUTES ---

// 1. Sign-up / Registration Route
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Hash the password securely before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create and save the new employee
        const newEmployee = await EmployeeModel.create({ 
            name, 
            email, 
            password: hashedPassword 
        });
        
        res.json({ status: "Success" });
    } catch (err) {
        // If the email already exists, MongoDB will throw a duplicate key error (code 11000)
        if (err.code === 11000) {
            res.json({ status: "Error", error: "Email already in use." });
        } else {
            res.json({ status: "Error", error: err.message });
        }
    }
});

// 2. Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find the user by email
        const user = await EmployeeModel.findOne({ email });

        if (user) {
            // Compare the entered password with the hashed password in the DB
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (isPasswordValid) {
                res.json({ status: "Success" });
            } else {
                res.json({ status: "Wrong password" });
            }
        } else {
            res.json({ status: "No record exists" });
        }
    } catch (err) {
        res.json({ status: "Error", error: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});