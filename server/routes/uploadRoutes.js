import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
  uploadDocument,
  getDocuments,
  getDocumentById,
  deleteDocument,
  updateDocument,     // Added Step 3
  searchDocuments,    // Added Step 5
  toggleStarDocument, 
   getSearchStats,// Added Step 6
} from "../controllers/uploadController.js";

const router = express.Router();
router.patch(
 "/:id/star",
 authMiddleware,
 toggleStarDocument
);

// ─── UPLOAD & FETCH ALL ───
router.post("/upload", authMiddleware, upload.single("document"), uploadDocument);

// STEP 6: Get all (now supports ?page=1&limit=10)
router.get("/all", authMiddleware, getDocuments);

// ─── SEARCH ───
// STEP 5: Search documents (MUST be above /:id)
router.get("/search", authMiddleware, searchDocuments);
router.get(
 "/stats",
 authMiddleware,
 getSearchStats
);

// ─── ID-BASED ROUTES ───
// STEP 2: Get single document
router.get("/:id", authMiddleware, getDocumentById);

// STEP 3: Update document
router.put("/:id", authMiddleware, updateDocument);

// STEP 1: Delete document
router.delete("/:id", authMiddleware, deleteDocument);

export default router;