import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useQuery } from "@apollo/client";
import { GET_ADMIN_NOTIFICATIONS, GET_USER_NOTIFICATIONS } from "../mutation/queries";
import { getCookie } from "@/function/GetCookie";
import { jwtDecode } from "jwt-decode";

interface Notification {
  message: string;
  id: string;
  isRead: boolean;
  createdAt?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const token = getCookie("accessToken");

  if (!token) {
    console.warn("No access token found. Notifications will be disabled.");
    return (
      <NotificationContext.Provider value={{ notifications: [], markAsRead: () => {} }}>
        {children}
      </NotificationContext.Provider>
    );
  }

  let decodedToken: { role: string };
  try {
    decodedToken = jwtDecode(token);
  } catch (error) {
    console.error("Invalid token format:", error);
    return (
      <NotificationContext.Provider value={{ notifications: [], markAsRead: () => {} }}>
        {children}
      </NotificationContext.Provider>
    );
  }

  const query = decodedToken.role === "USER"
    ? GET_USER_NOTIFICATIONS
    : GET_ADMIN_NOTIFICATIONS;

  const { data } = useQuery(query);

  useEffect(() => {
    const getQuery = decodedToken.role === "USER"
      ? data?.GetAllNotificationsOfUser
      : data?.getNotificationOfAdmin;

    if (getQuery) {
      setNotifications(getQuery || []);
    }
  }, [data]);

  useEffect(() => {
    const handleNotification = (notification: Notification) => {
      console.log("New Notification Received:", notification);

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notification.id);
        if (exists) return prev;

        if (Notification.permission === "granted") {
          try {
            new Notification("New Notification", {
              body: notification.message,
              icon: "/notification-icon.png",
            });
          } catch (error) {
            console.error("Notification Error:", error);
          }
        }

        return  [notification, ...prev];
      });
    };   

    socket.on("notification", handleNotification);
    return () => {socket.off("notification", handleNotification);}
  }, [socket]);

  useEffect(() => {
    const hasUnread = notifications.some((n) => !n.isRead);

    if (hasUnread) {
      const handleNotificationUpdated = () => {
        setNotifications((prev) =>
          prev.map((n) => ({ ...n, isRead: true }))
        );
      };

      socket.on("notification-updated", handleNotificationUpdated);
      return () => {socket.off("notification-updated", handleNotificationUpdated);}
    }
  }, [socket, notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

