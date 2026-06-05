import Activity from "../models/Activity.js";

export const getNotifications = async (
  req,
  res
) => {
  try {

    console.log("REQ USER");
    console.log(req.user);

    console.log("REQ USER ID");
    console.log(req.user.id);

    const notifications =
      await Activity.find({
        userId: req.user.id,
      })
    .sort({ createdAt: -1 })
    .limit(20);

    res.json({
      success: true,
      notifications,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

export const markNotificationRead =
async (req, res) => {

  try {

    const notification =
      await Activity.findOneAndUpdate(
        {
          _id: req.params.id,
          userId: req.user.id,
        },
        {
          isRead: true,
        },
        {
          new: true,
        }
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message:
          "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
export const markAllNotificationsRead =
async (req, res) => {

  try {
      console.log("READ ALL HIT");

    await Activity.updateMany(
      {
        userId: req.user.id,
        isRead: false,
      },
      {
        isRead: true,
      }
    );

    res.status(200).json({
      success: true,
      message:
        "All notifications marked read",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
export const clearNotifications =
async (req, res) => {

  try {

    await Activity.deleteMany({
      userId: req.user.id,
    });

    res.status(200).json({
      success: true,
      message:
        "Notifications cleared",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
export const deleteNotification =
async(req,res)=>{

 try{

  await Activity.findOneAndDelete({
   _id:req.params.id,
   userId:req.user.id
  });

  res.status(200).json({
   success:true
  });

 }catch(error){

  res.status(500).json({
   success:false,
   message:error.message
  });

 }

};
