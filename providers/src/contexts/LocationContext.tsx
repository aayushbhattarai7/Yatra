import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../function/GetCookie";
import { useSocket } from "./SocketContext";

interface LocationContextType {
  location: {
    latitude: number | null;
    longitude: number | null;
  };
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined,
);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<{
    latitude: number | null;
    longitude: number | null;
  }>({
    latitude: null,
    longitude: null,
  });

  const { socket } = useSocket();

  useEffect(() => {
    let watchId: number;

    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true },
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (
        location.latitude !== null &&
        location.longitude !== null &&
        socket
      ) {
        const token = getCookie("accessToken");

        if (token) {
          try {
            const decodedToken: any = jwtDecode(token);
            const userRole = decodedToken.role;

            if (userRole === "TRAVEL") {
              socket.emit("travel-location", {
                travelId: decodedToken.id,
                latitude: location.latitude,
                longitude: location.longitude,
              });
            } else if (userRole === "GUIDE") {
              socket.emit("guide-location", {
                guideId: decodedToken.id,
                latitude: location.latitude,
                longitude: location.longitude,
              });
            }
          } catch (error) {
            console.error("Error processing token:", error);
          }
        }
      }
    }, 5000);

    return () => clearInterval(intervalId);
  }, [location, socket]);

  return (
    <LocationContext.Provider value={{ location }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
