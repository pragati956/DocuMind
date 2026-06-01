import express from "express";

import authMiddleware
from "../middleware/authMiddleware.js";

import {
  summarizeDocument,
  getSummaries,
} from "../controllers/aiController.js";

const router =
  express.Router();

router.post(
  "/summarize/:id",
  authMiddleware,
  summarizeDocument
);
router.get(
  "/summaries",
  authMiddleware,
  getSummaries
);

export default router;