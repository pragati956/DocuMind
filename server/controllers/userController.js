import { UserModel } from "../models/User.js";

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