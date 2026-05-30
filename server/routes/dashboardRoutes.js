import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getDashboardStats,
  getActivities
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);
router.get(
  "/activities",
  authMiddleware,
  getActivities
);

export default router;