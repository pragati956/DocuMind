import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

import {
  uploadDocument,
  getDocuments,
} from "../controllers/uploadController.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  uploadDocument
);

router.get(
  "/all",
  authMiddleware,
  getDocuments
);

export default router;