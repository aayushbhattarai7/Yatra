import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useQuery } from "@apollo/client";
import { GET_USER_NOTIFICATIONS } from "../mutation/queries";

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

  const { data } = useQuery(GET_USER_NOTIFICATIONS);

  useEffect(() => {
    if (data?.GetAllNotificationsOfUser) {
      setNotifications(data?.GetAllNotificationsOfUser || []);
    }
  }, [data]);

  useEffect(() => {
    const handleNotification = (notification: Notification) => {
      console.log("New Notification Received:", notification);

      setNotifications((prev) => {
        const exists = prev.some((n) => n.id === notification.id);
        return exists ? prev : [notification, ...prev];
      });

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
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket]);

  useEffect(() => {
    const hasUnread = notifications.some((n) => !n.isRead);

    if (hasUnread) {
      const handleNotificationUpdated = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      };

      socket.on("notification-updated", handleNotificationUpdated);

      return () => {
        socket.off("notification-updated", handleNotificationUpdated);
      };
    }
  }, [socket, notifications]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
