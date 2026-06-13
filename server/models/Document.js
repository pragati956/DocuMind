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
starred: {
  type: Boolean,
  default: false,
},
views:{
 type:Number,
 default:0
},
lastOpened:{
 type:Date
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

    tags:{
 type:[String],
 default:[]
},
  },
  { timestamps: true }
);
documentSchema.index({
 uploadedBy:1
});
documentSchema.index({
 createdAt:-1
});

documentSchema.index({
 summary:1
});

documentSchema.index({
 title:"text"
});

const Document = mongoose.model("Document", documentSchema);

export default Document;