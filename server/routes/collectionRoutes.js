import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createCollection,
  getCollections,
  toggleStarCollection,
  deleteCollection,
} from "../controllers/collectionController.js";

const router = express.Router();

router.post("/", authMiddleware, createCollection);
router.get("/", authMiddleware, getCollections);
router.patch("/:id/star", authMiddleware, toggleStarCollection);
router.delete("/:id", authMiddleware, deleteCollection);

export default router;