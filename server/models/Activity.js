import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  documentId:{
 type:mongoose.Schema.Types.ObjectId,
 ref:"Document"
},

  action: {
    type: String,
    required: true,
  },

  documentName: {
    type: String,
    required: true,
  },

  isRead: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
}
);

export default mongoose.model(
  "Activity",
  activitySchema
);