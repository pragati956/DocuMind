import mongoose from "mongoose";

const searchHistorySchema =
 new mongoose.Schema(
  {
   userId:{
    type:
     mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
   },

   query:{
    type:String,
    required:true,
   },

   resultsCount:{
    type:Number,
    default:0,
   },
  },
  {
   timestamps:true,
  }
 );

export default mongoose.model(
 "SearchHistory",
 searchHistorySchema
);