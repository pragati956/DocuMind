import Activity from "../models/Activity.js";
import Document from "../models/Document.js";
import cloudinary from "../config/cloudinary.js"; 

export const uploadDocument = async (req, res) => {
  try {
    console.log("\n=== 🚀 NEW UPLOAD INITIATED ===");
    console.log("👤 User ID:", req.user?.id);

    if (!req.file) {
      console.log("❌ ERROR: req.file is undefined. Multer or Cloudinary rejected the stream.");
      return res.status(400).json({ message: "No file uploaded" });
    }
    console.log("REQ FILE DATA:");
console.log(req.file);

    const fileUrl = req.file.path || req.file.secure_url;
    const publicId = req.file.filename || req.file.public_id;

    if (!fileUrl || !publicId) {
      return res.status(500).json({ message: "Cloudinary payload missing URL or ID." });
    }

    const newDocument = await Document.create({
      title: req.file.originalname || "Untitled Document",
      fileUrl: fileUrl,
      publicId: publicId,
      fileType: req.file.mimetype || "application/octet-stream",
      fileSize: req.file.size || 0,
      uploadedBy: req.user.id, 
    });
   await Activity.create({
 userId:req.user.id,
 documentId:newDocument._id,
 action:"uploaded",
 documentName:newDocument.title,
});

    console.log("✅ SUCCESS! Saved to MongoDB:", newDocument._id);

    res.status(201).json({
      message: "Document uploaded successfully",
      document: newDocument,
    });
  } catch (error) {
    console.error("❌ MONGODB CRASH:", error);
    res.status(500).json({ message: error.message });
  }
};

// ─── STEP 6: GET ALL DOCUMENTS (WITH PAGINATION) ───
export const getDocuments = async (req, res) => {
  try {
    // Default to page 1 and 10 items per page if not specified in the URL
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalDocuments = await Document.countDocuments({ uploadedBy: req.user.id });
    
   const documents =
 await Document.find({
  uploadedBy:req.user.id
 })
 .populate(
   "uploadedBy",
   "name email"
 )
 .sort({
   createdAt:-1
 })
 .skip(skip)
 .limit(limit);

    res.status(200).json({
      success: true,
      documents,
      currentPage: page,
      totalPages: Math.ceil(totalDocuments / limit),
      totalDocuments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── STEP 5: SEARCH DOCUMENTS API ───
export const searchDocuments = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ success: false, message: "Search query 'q' is required" });
    }

    // $regex provides a basic keyword search. $options: "i" makes it case-insensitive.
  const documents =
 await Document.find({
  uploadedBy:req.user.id,
  title:{
   $regex:q,
   $options:"i"
  }
 })
 .populate(
   "uploadedBy",
   "name email"
 )
 .sort({
   createdAt:-1
 });

    res.status(200).json({ success: true, documents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── STEP 2: GET SINGLE DOCUMENT ───
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

// ─── STEP 3: UPDATE DOCUMENT API ───
export const updateDocument = async (req, res) => {
  try {
    const { title, tags, summary } = req.body;

   const document = await Document.findOneAndUpdate(
  { _id: req.params.id, uploadedBy: req.user.id },
  { $set: { title, tags, summary } },
  {
    returnDocument: "after",
    runValidators: true,
  }
);

    if (!document) {
      return res.status(404).json({ success: false, message: "Document not found or unauthorized" });
    }
   await Activity.create({
 userId:req.user.id,
 documentId:document._id,
 action:"edited",
 documentName:document.title,
});

    res.status(200).json({ success: true, message: "Document updated successfully", document });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── STEP 1: DELETE DOCUMENT ───
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
   await Activity.create({
 userId:req.user.id,
 documentId:document._id,
 action:"deleted",
 documentName:document.title,
});
    await Document.findByIdAndDelete(document._id);

    res.status(200).json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const toggleStarDocument =
async (req, res) => {

 try {

  const document =
   await Document.findOne({
    _id: req.params.id,
    uploadedBy: req.user.id,
   });

  if (!document) {

   return res.status(404).json({
    success: false,
    message: "Document not found",
   });

  }

  document.starred =
   !document.starred;

  await document.save();
 await Activity.create({
 userId:req.user.id,
 documentId:document._id,
 action:"starred",
 documentName:document.title,
});

  res.status(200).json({
   success: true,
   document,
  });

 } catch (error) {

  res.status(500).json({
   success: false,
   message: error.message,
  });

 }

};