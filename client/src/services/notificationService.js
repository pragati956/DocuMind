import API from "./api";

export const fetchNotifications =
  async () => {
    const res =
      await API.get(
        "/notifications"
      );

    return res.data;
};
export const markNotificationRead =
async (id) => {

  const res =
    await API.patch(
      `/notifications/${id}/read`
    );

  return res.data;
};
export const markAllNotificationsRead =
async () => {

  const res =
    await API.patch(
      "/notifications/read-all"
    );

  return res.data;
};
export const clearNotifications =
async () => {

  const res =
    await API.delete(
      "/notifications"
    );

  return res.data;
};
export const deleteNotification =
async(id)=>{

 const res =
  await API.delete(
   `/notifications/${id}`
  );

 return res.data;

};