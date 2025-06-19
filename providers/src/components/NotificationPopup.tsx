import { useNotifications } from "../contexts/NotificationContext";
import { formatTimeDifference } from "../function/TimeDifference";

const NotificationsPopup = () => {
  const { notifications, markAsRead } = useNotifications();

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
              onClick={() => markAsRead(notification.id)}
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
