import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      default: "",
    },
    privacy: {
      type: String,
      enum: ["private", "team", "public"],
      default: "team",
    },
    color: {
      type: String,
      default: "from-blue-500 to-indigo-600",
    },
    starred: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // References to the documents stored inside this collection
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Collection", collectionSchema);