import { useSocket } from "@/contexts/SocketContext";
import { formatTimeDifference } from "@/function/TimeDifference";
import { GET_USER_NOTIFICATIONS } from "@/mutation/queries";
import { useQuery } from "@apollo/client";
import  { useEffect, useState } from "react";
interface Notifications {
  id: string;
  isRead: boolean;
  message: string;
  createdAt:string

}
const NotificationsPopup = () => {
      const [notifications, setNotifications] = useState<Notifications[]>([]);
  const { socket } = useSocket();

 const { data } = useQuery(GET_USER_NOTIFICATIONS);
 useEffect(() => {
   if (data?.getAllNotificationsOfUser) {
     setNotifications(data.getAllNotificationsOfUser);
   }
 }, [data]);
 useEffect(() => {
   socket.on("notification", (notification) => {
     setNotifications(notification);
   });
 }, [socket]);
  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <div>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                  !notification.isRead ? "bg-blue-50" : ""
                }`}
              >
                <p className="text-sm text-gray-600 mt-1">
                  {notification.message}
                </p>
                <span className="text-xs text-gray-500 mt-2 block">
                  {formatTimeDifference(notification.createdAt)}
                </span>
                <div className="p-3 text-center border-t border-gray-200">
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View All Notifications
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="flex justify-center items-center font-poppins p-5">
            No notifications yet
          </p>
        )}
      </div>
    </div>
  );
};

export default NotificationsPopup;
