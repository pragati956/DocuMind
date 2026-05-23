import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
    },

    extractedText: {
      type: String,
      default: "",
    },

  },
  {
    timestamps: true,
  }
);

export const DocumentModel = mongoose.model(
  "Document",
  documentSchema
);