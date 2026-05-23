import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";
import { uploadDocument, getDocuments } from "../controllers/uploadController.js";

const router = express.Router();

router.post("/", authMiddleware, (req, res, next) => {
    upload(req, res, (error) => {
        if (error) {
            return res.status(400).json({
                success: false,
                message: error.message,
            });
        }
        next();
    });
}, uploadDocument);

router.get("/", authMiddleware, getDocuments);

export default router;
