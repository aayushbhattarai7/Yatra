import { useEffect, useState, useMemo } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useQuery } from "@apollo/client";
import { GET_GUIDE_NOTIFICATIONS, GET_TRAVEL_NOTIFICATIONS } from "../mutation/queries";
import { formatTimeDifference } from "../function/TimeDifference";
import { getCookie } from "../function/GetCookie";
import { jwtDecode } from "jwt-decode";

interface Notification {
  message: string;
  id: string;
  isRead: boolean;
  createdAt?: string;
}

const NotificationsPopup = () => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const token = getCookie("accessToken");

  const decodedToken = useMemo(() => {
    if (!token) return null;
    try {
      return jwtDecode<{ id: string; role: string }>(token);
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  }, [token]);

  const query = decodedToken?.role === "TRAVEL" ? GET_TRAVEL_NOTIFICATIONS : GET_GUIDE_NOTIFICATIONS;
  const { data, loading: queryLoading, refetch } = useQuery(query, { skip: !decodedToken });

  useEffect(() => {
    if (data) {
      const fetchedNotifications =
        decodedToken?.role === "TRAVEL"
          ? data.getAllNotificationsOfTravel
          : data.getAllNotificationsOfGuide;

      setNotifications(fetchedNotifications || []);
      setLoading(false);
    }
  }, [data, decodedToken]);

 

  useEffect(() => {
    const handleNotification = (notification: Notification) => {
      console.log(" New Notification received:", notification);

      if (Notification.permission === "granted") {
        console.log(" Sending system notification...");
        try {
          new Notification("New Notification", {
            body: notification.message,
            icon: "/notification-icon.png",
          });
          console.log(" Notification sent successfully!");
        } catch (error) {
          console.error(" Notification Error:", error);
        }
      } else {
        console.warn(" Notification permission not granted");
      }

      setNotifications((prev) => [notification, ...prev]);
      refetch();
    };

    socket.on("notification", handleNotification);
    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, refetch]);

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>

      {loading || queryLoading ? (
        <p className="flex justify-center items-center font-poppins p-5">Loading...</p>
      ) : notifications.length > 0 ? (
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                !notification.isRead ? "bg-blue-50" : ""
              }`}
            >
              <p className="text-sm text-gray-600 mt-1 truncate">{notification.message}</p>
              <span className="text-xs text-gray-500 mt-2 block">
                {notification.createdAt ? formatTimeDifference(notification.createdAt) : "Unknown time"}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="flex justify-center items-center font-poppins p-5">No notifications found</p>
      )}

      <div className="p-3 text-center border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800">View All Notifications</button>
      </div>
    </div>
  );
};

export default NotificationsPopup;
