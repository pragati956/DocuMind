import { DocumentModel } from "../models/Document.js";

export const uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded",
            });
        }

        const document = await DocumentModel.create({
            user: req.user.id,
            filename: req.file.filename,
            originalName: req.file.originalname,
            mimeType: req.file.mimetype,
            size: req.file.size,
            path: req.file.path,
        });

        res.status(201).json({
            success: true,
            message: "Document uploaded successfully",
            document,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getDocuments = async (req, res) => {
    try {
        const documents = await DocumentModel.find({ user: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            documents,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
