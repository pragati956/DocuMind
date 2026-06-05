import express from "express";

import {
 getNotifications,
 markNotificationRead,
 markAllNotificationsRead,
 clearNotifications,
 deleteNotification
}
from "../controllers/notificationController.js";

import authMiddleware
from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
 "/",
 authMiddleware,
 getNotifications
);
router.patch(
 "/read-all",
 authMiddleware,
 markAllNotificationsRead
);
router.delete(
 "/:id",
 authMiddleware,
 deleteNotification
);

router.patch(
 "/:id/read",
 authMiddleware,
 markNotificationRead
);

router.delete(
 "/",
 authMiddleware,
 clearNotifications
);

export default router;