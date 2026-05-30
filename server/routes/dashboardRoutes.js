import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getDashboardStats,
} from "../controllers/dashboardController.js";

const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);

export default router;