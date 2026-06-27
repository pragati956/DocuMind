import Activity from "../models/Activity.js";
import Document from "../models/Document.js";
import { UserModel }
from "../models/User.js";
import Collection from "../models/Collection.js"; // <-- ADD THIS IMPORT
import { sendEmail } from "../utils/sendEmail.js";
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

   const totalUsers = await UserModel.countDocuments();

   // --- ADD THIS QUERY ---
    const totalCollections = await Collection.countDocuments({ 
      createdBy: req.user.id 
    });

   res.status(200).json({
  success: true,
  totalDocuments,
  summarizedDocuments,
  starredDocuments,
  totalCollections, // <-- ADD THIS TO THE RESPONSE
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
export const getFeaturesStats =
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

  res.status(200).json({
   success:true,
   totalDocuments,
   totalSummaries,
   totalUsers
  });

 }catch(error){

  res.status(500).json({
   success:false,
   message:error.message
  });

 }

};
export const reportBug = async (req, res) => {
  try {
    const { type, severity, subject, description } = req.body;
    const user = await UserModel.findById(req.user.id);

    if (!subject || !description) {
      return res.status(400).json({ success: false, message: "Subject and description are required" });
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; color: #333; max-w: 600px; margin: 0 auto; border: 1px solid #eaeaea; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #f87171; padding: 20px; color: white;">
          <h2 style="margin: 0; font-size: 20px;">New Bug Report</h2>
        </div>
        <div style="padding: 20px;">
          <p><strong>Reporter:</strong> ${user.name} (<a href="mailto:${user.email}">${user.email}</a>)</p>
          <p><strong>Issue Type:</strong> ${type}</p>
          <p><strong>Severity:</strong> <span style="background: #fee2e2; color: #b91c1c; padding: 4px 8px; border-radius: 4px; font-weight: bold;">${severity}</span></p>
          <hr style="border: 0; border-top: 1px solid #eaeaea; margin: 20px 0;" />
          <h3 style="margin-top: 0;">${subject}</h3>
          <p style="background: #f9fafb; padding: 15px; border-radius: 6px; white-space: pre-wrap;">${description}</p>
        </div>
      </div>
    `;

    // Sends the bug report to the system admin (your EMAIL_USER)
    await sendEmail({
      to: "naruto95691@gmail.com",
      subject: `[BUG REPORT - ${severity.toUpperCase()}] ${subject}`,
      text: emailHtml,
    });

    // ADD THIS TO LOG THE BUG REPORT IN ACTIVITY FEED
    await Activity.create({
      userId: req.user.id,
      action: "bug_reported",
      documentName: subject,
    });

    res.status(200).json({ success: true, message: "Bug report submitted successfully" });
  } catch (error) {
    console.error("Bug Report Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};