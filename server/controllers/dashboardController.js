import Activity from "../models/Activity.js";
import Document from "../models/Document.js";
import { UserModel }
from "../models/User.js";
export const getActivities =
async (req, res) => {
  try {

    const activities =
      await Activity.find({
        userId: req.user.id,
      })
      .sort({ createdAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      activities,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const getDashboardStats = async (
  req,
  res
) => {
  try {

    const totalDocuments =
      await Document.countDocuments({
        uploadedBy: req.user.id,
      });

    const summarizedDocuments =
      await Document.countDocuments({
        uploadedBy: req.user.id,
        summary: { $ne: "" },
      });
      const starredDocuments =
  await Document.countDocuments({
    uploadedBy: req.user.id,
    starred: true,
  });

   const totalUsers = await User.countDocuments();

   res.status(200).json({
  success: true,
  totalDocuments,
  summarizedDocuments,
  starredDocuments,
});

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
export const getPublicStats =
async (req,res)=>{

 try{

  const totalDocuments =
   await Document.countDocuments();

  const totalUsers =
   await UserModel.countDocuments();

  const totalSummaries =
   await Document.countDocuments({
    summary:{
     $exists:true,
     $ne:""
    }
   });

  res.status(200).json({
   success:true,
   totalDocuments,
   totalUsers,
   totalSummaries,
  });

 }catch(error){

  res.status(500).json({
   success:false,
   message:error.message,
  });

 }

};
export const getHeroPreview =
async(req,res)=>{

 try{

  const totalDocuments =
   await Document.countDocuments();

  const totalSummaries =
   await Document.countDocuments({
    summary:{
     $exists:true,
     $ne:""
    }
   });

  const totalUsers =
   await UserModel.countDocuments();

  // NEW

  const processing =
   totalDocuments === 0
    ? 0
    : Math.round(
       (totalSummaries /
        totalDocuments) * 100
      );

  const latestSummaryDoc =
   await Document.findOne({
    summary:{
     $exists:true,
     $ne:""
    }
   })
   .sort({
    updatedAt:-1
   });

  const latestSummary =
   latestSummaryDoc
    ? latestSummaryDoc.title
    : "No summaries yet";

  const today =
   new Date();

  today.setHours(
   0,0,0,0
  );

  const documentsProcessedToday =
   await Document.countDocuments({
    createdAt:{
     $gte:today
    }
   });

  res.json({
   success:true,

   totalDocuments,
   totalSummaries,
   totalUsers,

   processing,
   latestSummary,
   documentsProcessedToday,
  });

 }catch(error){

  res.status(500).json({
   success:false,
   message:error.message
  });

 }

};