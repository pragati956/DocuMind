import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  uploadDocument,
  getDocuments,
  getDocumentById, // Added Step 2 controller
  deleteDocument,  // Added Step 1 controller
} from "../controllers/uploadController.js";

const router = express.Router();

// ─── EXISTING ROUTES ───
// Upload a new document (Requires Auth + Multer parsing)
router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  uploadDocument
);

// Get all documents for the logged-in user
router.get(
  "/all",
  authMiddleware,
  getDocuments
);

// ─── NEW ROUTES (STEPS 1 & 2) ───

// STEP 2: Get a single document by ID (Requires Auth)
router.get(
  "/:id",
  authMiddleware,
  getDocumentById
);

// STEP 1: Delete a document by ID (Requires Auth)
router.delete(
  "/:id",
  authMiddleware,
  deleteDocument
);

export default router;