import Activity from "../models/Activity.js";
import Document from "../models/Document.js";
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