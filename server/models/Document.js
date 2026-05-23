import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },

    fileType: {
      type: String,
    },

    fileSize: {
      type: Number,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    summary: {
      type: String,
      default: "",
    },

    tags: [String],
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;