import { useSocket } from "@/contexts/SocketContext";
import { GET_USER_NOTIFICATIONS } from "@/mutation/queries";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

interface Notifications {
  id: string;
  isRead: boolean;
  message: string;
  createdAt?: string; 
}

const NotificationsPopup = () => {
  const [notifications, setNotifications] = useState<Notifications[]>([]);
  const { socket } = useSocket();

  const { data } = useQuery(GET_USER_NOTIFICATIONS);

  useEffect(() => {
    if (data?.getAllNotificationsOfUser && Array.isArray(data.getAllNotificationsOfUser)) {
      setNotifications(data.getAllNotificationsOfUser);
    }
  }, [data]);

  useEffect(() => {
    socket.on("notification", (notification: Notifications) => {
      if (notification && notification.id) {
        setNotifications((prev) => [...prev, notification]);
      }
    });

    socket.on("notification-updated", ({ isRead }) => {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true }))
      );
    })

    return () => {
      socket.off("notification");
    };
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
                {notification.createdAt ? (
                  <span className="text-xs text-gray-500 mt-2 block">
                    {new Date(notification.createdAt).toLocaleTimeString()}
                  </span>
                ) : null}
              </div>
            ))}
            <div className="p-3 text-center border-t border-gray-200">
              <button className="text-sm text-blue-600 hover:text-blue-800">
                View All Notifications
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 pb-5">
          <p className="text-sm">No notifications yet</p>
          <p className="text-xs">We will notify you if we get one!</p>
        </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPopup;
