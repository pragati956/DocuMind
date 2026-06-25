import {
 createContext,
 useState,
 useEffect,
 useContext,
 useRef,
 useCallback
} from "react";
import {
 fetchNotifications,
 deleteNotification as apiDeleteNotification,
 markNotificationRead,
 markAllNotificationsRead,

}

from "../services/notificationService";


import {
 clearNotifications as apiClearNotifications
}

from "../services/notificationService";

export const NotificationContext =
 createContext(null);
 export const NotificationProvider =
 ({children}) => {

 const [
  notifications,
  setNotifications
 ] = useState([]);

 const [loading, setLoading] =
 useState(false);
 const loadingRef =
 useRef(false);
const bugDismissTimersRef = useRef(new Map());

const loadNotifications =
useCallback(
 async () => {

  if (
   loadingRef.current
  ) return;

  try {

   loadingRef.current = true;

   setLoading(true);

   const data =
    await fetchNotifications();

   setNotifications(
    data.notifications || []
   );

  } catch(error){

   console.error(error);

  } finally {

   loadingRef.current = false;

   setLoading(false);

  }

 },
 []
);
 const deleteNotification =
async (id) => {

 try {

  await apiDeleteNotification(id);

  await loadNotifications();

 } catch (error) {

  console.error(error);

 }

};

const unreadCount =
 notifications.filter(
  n => !n.isRead
 ).length;
 const markRead =
async(id)=>{

 try{

  await markNotificationRead(id);

  await loadNotifications();

 }catch(error){

  console.error(error);

 }

};
const markAll =
async () => {

 try {

  await markAllNotificationsRead();

  await loadNotifications();

 } catch (error) {

  console.error(error);

 }

};

const clearAll =
async () => {

 try {

  await apiClearNotifications();

  await loadNotifications();

 } catch (error) {

  console.error(error);

 }

};

useEffect(() => {
 const activeIds = new Set(
  notifications
   .filter((n) => n.action === "bug_reported")
   .map((n) => n._id || n.id)
 );

 for (const [id, timer] of bugDismissTimersRef.current.entries()) {
  if (!activeIds.has(id)) {
   clearTimeout(timer);
   bugDismissTimersRef.current.delete(id);
  }
 }

 notifications.forEach((notification) => {
  if (notification.action !== "bug_reported") return;

  const id = notification._id || notification.id;
  if (!id || bugDismissTimersRef.current.has(id)) return;

  const timer = setTimeout(async () => {
   bugDismissTimersRef.current.delete(id);
   await deleteNotification(id);
  }, 1500);

  bugDismissTimersRef.current.set(id, timer);
 });
}, [notifications]);

useEffect(() => {
 return () => {
  for (const timer of bugDismissTimersRef.current.values()) {
   clearTimeout(timer);
  }
  bugDismissTimersRef.current.clear();
 };
}, []);

useEffect(() => {

  loadNotifications();

  const interval =
    setInterval(() => {
      loadNotifications();
    }, 30000);

  return () =>
    clearInterval(interval);

}, [loadNotifications]);

 return (

  <NotificationContext.Provider
  value={{
 notifications,
 setNotifications,
 loadNotifications,
 deleteNotification,
 markRead,
 markAll,
 clearAll,
 unreadCount,
 loading
}}
  >
   {children}
  </NotificationContext.Provider>

 );

};
export const useNotifications =
 () => useContext(
  NotificationContext
 );
