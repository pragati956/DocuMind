import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
  getProfile,
  updateProfile,
} from "../controllers/userController.js";

const router =
  express.Router();

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

export default router;