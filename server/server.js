// import dotenv from "dotenv";
// dotenv.config({ path: "./.env" });
import "./config/env.js";

import express from "express";
import cors from "cors";
import passport from "passport"; // Imported passport
import { initializePassport } from "./config/passport.js"; 
import aiRoutes
from "./routes/aiRoutes.js";
import dashboardRoutes
from "./routes/dashboardRoutes.js";
// Import the initialization function

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

// Initialize passport strategies after env vars are loaded
initializePassport();

const app = express();

// DATABASE CONNECTION
connectDB();

// MIDDLEWARE
app.use(cors());
app.use(express.json());
app.use(passport.initialize()); // Initialized passport middleware

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/documents", uploadRoutes);
app.use(
  "/api/dashboard",
  dashboardRoutes
);
app.use(
  "/api/ai",
  aiRoutes
);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("🚀 DocuMind API Running");
});

// OAuth DEBUG ENDPOINT
app.get("/api/auth/debug", (req, res) => {
  res.json({
    googleClientID: process.env.GOOGLE_CLIENT_ID ? "✅ Loaded" : "❌ Missing",
    githubClientID: process.env.GITHUB_CLIENT_ID ? "✅ Loaded" : "❌ Missing",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});