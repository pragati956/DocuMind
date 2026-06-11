import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    // Force Cloudinary to treat non-images as raw files so it doesn't reject them
    const isImage = file.mimetype.startsWith("image/");
    
    return {
      folder: "documind-documents",
      resource_type: isImage ? "image" : "raw",
      // Adding public_id generator to ensure unique names
public_id:
 `${Date.now()}-${file.originalname
   .split(".")[0]
   .replace(/[^a-zA-Z0-9]/g,"-")}`    };
  },
});

// Strict backend validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/msword", // DOC
    "text/plain", // TXT
    "image/jpeg",
    "image/png",
    "image/jpg",
    "image/webp"
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only PDF, DOCX, TXT, and images allowed."), false);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter 
});

export default upload;