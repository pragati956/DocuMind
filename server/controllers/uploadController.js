import Document from "../models/Document.js";
import cloudinary from "../config/cloudinary.js"; 

export const uploadDocument = async (req, res) => {
  console.log("🔥 Controller received upload request"); 
  try {
    if (!req.file) {
      console.log("❌ No file found in req.file");
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newDocument = await Document.create({
      title: req.file.originalname,
      fileUrl: req.file.path,
      publicId: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      uploadedBy: req.user.id,
    });

    console.log("✅ Document successfully saved to MongoDB:", newDocument._id);
    res.status(201).json({
      message: "Document uploaded successfully",
      document: newDocument,
    });
  } catch (error) {
    console.error("❌ MongoDB Save Error:", error); // Check your terminal for this!
    res.status(500).json({ message: error.message });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({ uploadedBy: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      documents,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── STEP 2: GET SINGLE DOCUMENT API ───
export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({ 
      _id: req.params.id, 
      uploadedBy: req.user.id 
    });

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found" });
    }

    res.status(200).json({ success: true, document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── STEP 1: DELETE DOCUMENT API ───
export const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findOne({ 
      _id: req.params.id, 
      uploadedBy: req.user.id 
    });

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found or unauthorized" });
    }

    const resourceType = (document.fileType.includes("word") || document.fileType.includes("text")) ? "raw" : "image";

    await cloudinary.uploader.destroy(document.publicId, { resource_type: resourceType });
    await Document.findByIdAndDelete(document._id);

    res.status(200).json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};