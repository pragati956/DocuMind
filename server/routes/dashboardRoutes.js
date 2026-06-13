import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getDashboardStats,
  getActivities, getPublicStats,getHeroPreview,getFeaturesStats,
} from "../controllers/dashboardController.js";

const router = express.Router();
router.get(
 "/public-stats",
 getPublicStats
);
router.get(
 "/hero-preview",
 getHeroPreview
);
router.get(
  "/stats",
  authMiddleware,
  getDashboardStats
);
router.get(
 "/features-stats",
 getFeaturesStats
);
router.get(
  "/activities",
  authMiddleware,
  getActivities
);


export default router;