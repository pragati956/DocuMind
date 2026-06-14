import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: {
  type: String,
  required: true,
  trim: true,
  minlength: 2,
  maxlength: 50,
},
    desc: {
  type: String,
  default: "",
  
  maxlength: 300,
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
    // Add this new field inside collectionSchema
    aiSummary: {
      type: String,
      default: "",
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
collectionSchema.index({
  createdBy: 1,
  createdAt: -1,
});

export default mongoose.model("Collection", collectionSchema);