import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
  getProfile,
  updateProfile,
  getNotificationPreferences,
  updateNotificationPreferences,
  changePassword,
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
router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

export default router;