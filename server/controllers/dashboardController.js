import Document from "../models/Document.js";

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

    const processingDocuments = 0;

    res.status(200).json({
      success: true,
      totalDocuments,
      summarizedDocuments,
      processingDocuments,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};