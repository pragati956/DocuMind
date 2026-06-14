import express from "express";
import passport from "passport"; // Imported passport
import jwt from "jsonwebtoken"; // Imported jsonwebtoken to manually sign tokens for OAuth users
import { registerUser, loginUser, forgotPassword, resetPassword } from "../controllers/authController.js";

const router = express.Router();

// AUTH ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.put("/reset-password/:token", resetPassword);

// Added Google OAuth Initialization Route
router.get("/google", (req, res, next) => {
  console.log("🔵 Google OAuth route triggered");
  passport.authenticate("google", { scope: ["profile", "email"], session: false })(req, res, next);
});

// Added Google OAuth Callback Route
router.get("/google/callback", (req, res, next) => {
  console.log("🔵 Google Callback route triggered");
  passport.authenticate("google", { session: false, failureRedirect: "http://localhost:5173/login?error=true" })(req, res, (err) => {
    if (err) {
      console.error("❌ Google Auth error:", err);
      return res.redirect("http://localhost:5173/login?error=true");
    }
    console.log("✅ Google Auth successful, user:", req.user);
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const userString = encodeURIComponent(JSON.stringify({ name: req.user.name, email: req.user.email }));
    res.redirect(`http://localhost:5173/oauth-callback?token=${token}&user=${userString}`);
  });
});

// Added GitHub OAuth Initialization Route
router.get("/github", (req, res, next) => {
  console.log("🔵 GitHub OAuth route triggered");
  passport.authenticate("github", { scope: ["user:email"], session: false })(req, res, next);
});

// Added GitHub OAuth Callback Route
router.get("/github/callback", (req, res, next) => {
  console.log("🔵 GitHub Callback route triggered");
  passport.authenticate("github", { session: false, failureRedirect: "http://localhost:5173/login?error=true" })(req, res, (err) => {
    if (err) {
      console.error("❌ GitHub Auth error:", err);
      return res.redirect("http://localhost:5173/login?error=true");
    }
    console.log("✅ GitHub Auth successful, user:", req.user);
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    const userString = encodeURIComponent(JSON.stringify({ name: req.user.name, email: req.user.email }));
    res.redirect(`http://localhost:5173/oauth-callback?token=${token}&user=${userString}`);
  });
});

export default router;