import { UserModel } from "../models/User.js";
import bcrypt from "bcryptjs";
import Document from "../models/Document.js";

export const getProfile = async (req, res) => {
  try {

    const user =
      await UserModel.findById(
        req.user.id
      ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

export const updateProfile = async (req, res) => {

  try {

    const {
      name,
      role,
      bio,
    } = req.body;

    const user =
      await UserModel.findByIdAndUpdate(
        req.user.id,
        {
          name,
          role,
          bio,
        },
        {
          new: true,
        }
      ).select("-password");

    res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
export const getNotificationPreferences =
async (req, res) => {

  try {

    const user =
      await UserModel.findById(
        req.user.id
      );

    res.status(200).json({
      success: true,
      notifications:
        user.notificationPreferences,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

export const updateNotificationPreferences =
async (req, res) => {

  try {

    const user =
      await UserModel.findByIdAndUpdate(
        req.user.id,
        {
          notificationPreferences:
            req.body,
        },
        {
          new: true,
        }
      );

    res.status(200).json({
      success: true,
      notifications:
        user.notificationPreferences,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
export const changePassword =
async (req, res) => {

  try {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user =
      await UserModel.findById(
        req.user.id
      );

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });

    }

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message:
          "Current password is incorrect",
      });

    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password =
      hashedPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message:
        "Password updated successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
export const getStorageStats =
async (req, res) => {

  try {

    const documents =
      await Document.find({
        uploadedBy:
          req.user.id,
      });
 

    const totalDocuments =
      documents.length;

    const pdfCount =
      documents.filter(
        doc =>
          doc.fileType?.includes(
            "pdf"
          )
      ).length;

    const docxCount =
      documents.filter(
        doc =>
          doc.fileType?.includes(
            "word"
          )
      ).length;

    const txtCount =
      documents.filter(
        doc =>
          doc.fileType?.includes(
            "text"
          )
      ).length;

    let totalStorageMB = 0;

    documents.forEach(
      (doc) => {

        if (doc.fileSize) {

          totalStorageMB +=
            doc.fileSize /
            (1024 * 1024);

        }

      }
    );

    res.status(200).json({
      success: true,
      totalDocuments,
      pdfCount,
      docxCount,
      txtCount,
      totalStorageMB:
        Number(
          totalStorageMB.toFixed(2)
        ),
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message:
        error.message,
    });

  }

};