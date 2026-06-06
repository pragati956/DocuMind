import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
  getProfile,
  updateProfile,
  getNotificationPreferences,
  updateNotificationPreferences,
}
from "../controllers/userController.js";

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
router.get(
  "/notifications",
  authMiddleware,
  getNotificationPreferences
);

router.put(
  "/notifications",
  authMiddleware,
  updateNotificationPreferences
);

export default router;