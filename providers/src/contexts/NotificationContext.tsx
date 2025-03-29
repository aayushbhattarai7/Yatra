import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useSocket } from "../contexts/SocketContext";
import { useQuery } from "@apollo/client";
import { GET_GUIDE_NOTIFICATIONS, GET_TRAVEL_NOTIFICATIONS } from "../mutation/queries";
import { getCookie } from "../function/GetCookie";
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
  const { data } = useQuery(query, { skip: !decodedToken });

  useEffect(() => {
    if (data) {
      const fetchedNotifications =
        decodedToken?.role === "TRAVEL"
          ? data.getAllNotificationsOfTravel
          : data.getAllNotificationsOfGuide;
      setNotifications(fetchedNotifications || []);
    }
  }, [data, decodedToken]);

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

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  }, []);

  return (
    <NotificationContext.Provider value={{ notifications, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};
