import Document from "../models/Document.js";

export const uploadDocument = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    const newDocument = await Document.create({
      title: req.file.originalname,
      fileUrl: req.file.path,
     publicId: req.file.filename || req.file.public_id,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
    });

    res.status(201).json({
      message: "Document uploaded successfully",
      document: newDocument,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });

  }
};

export const getDocuments = async (req, res) => {
  try {

    const documents = await Document.find();

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