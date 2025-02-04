
const NotificationsPopup = () => {
  const notifications = [
    {
      id: 1,
      title: "New Booking Confirmed",
      message: "Your booking for Paris trip has been confirmed.",
      time: "5m ago",
      read: false,
    },
    {
      id: 2,
      title: "Travel Update",
      message: "Flight schedule changed for your upcoming trip.",
      time: "1h ago",
      read: true,
    },
  ];

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Notifications</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
              !notification.read ? "bg-blue-50" : ""
            }`}
          >
            <h4 className="text-sm font-semibold">{notification.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
            <span className="text-xs text-gray-500 mt-2 block">
              {notification.time}
            </span>
          </div>
        ))}
      </div>
      <div className="p-3 text-center border-t border-gray-200">
        <button className="text-sm text-blue-600 hover:text-blue-800">
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsPopup;
