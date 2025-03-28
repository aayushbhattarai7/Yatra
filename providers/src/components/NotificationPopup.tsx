import { useEffect, useState } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useQuery } from "@apollo/client";
import { GET_TRAVEL_NOTIFICATIONS } from "../mutation/queries";
import { formatTimeDifference } from "../function/TimeDifference";

interface Notification {
  message: string;
  id: string;
  isRead: boolean;
  createdAt?: string; 
}

const NotificationsPopup = () => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { data } = useQuery(GET_TRAVEL_NOTIFICATIONS);

  console.log("🚀 ~ NotificationsPopup ~ data:", data);

  useEffect(() => {
    if(data?.getAllNotificationsOfTravel) setNotifications(data.getAllNotificationsOfTravel);
    
  }, [data]);

  useEffect(() => {
    const handleNotification = (notification: Notification) => {
     console.log("🚀 ~ handleNotification ~ notification:", notification)
     
        setNotifications((prev) => [...prev, notification]);
      
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification); 
    };
  }, [socket]);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      {notifications.length > 0 ? (
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                !notification.isRead ? "bg-blue-50" : ""
              }`}
            >
              <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
              {notification.createdAt ? (
                <span className="text-xs text-gray-500 mt-2 block">
                  {/* {new Date(notification.createdAt).toLocaleTimeString()} */}
                  {formatTimeDifference(notification.createdAt)}
                </span>
              ) : (
                <span className="text-xs text-gray-500 mt-2 block">Unknown time</span>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="flex justify-center items-center font-poppins p-5">No notifications found</p>
      )}
      <div className="p-3 text-center border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsPopup;
