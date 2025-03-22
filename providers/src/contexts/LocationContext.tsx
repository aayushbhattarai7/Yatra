import React, { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "../function/GetCookie";
import { useSocket } from "./SocketContext";
import throttle from "lodash.throttle";

interface LocationContextType {
  location: {
    latitude: number | null;
    longitude: number | null;
  };
}

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
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
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    }
  }, []);

  const emitLocation = throttle((updatedLocation) => {
    const token = getCookie("accessToken");

    if (token) {
      try {
        const decodedToken: any = jwtDecode(token);
        console.log("🚀 ~ emitLocation ~ decodedToken:", decodedToken)
        const userRole = decodedToken.role;

        if (socket) {
          if (userRole === "TRAVEL") {
            socket.emit("travel-location", {
              travelId: decodedToken.id,
              latitude: updatedLocation.latitude,
              longitude: updatedLocation.longitude,
            });
            console.log("TRAVEL location emitted:", updatedLocation);
          } else if (userRole === "GUIDE") {
            socket.emit("guide-location", {
              guideId: decodedToken.id,
              latitude: updatedLocation.latitude,
              longitude: updatedLocation.longitude,
            });
            console.log("GUIDE location emitted:", updatedLocation);
          }
        } else {
          console.error("Socket is not initialized!");
        }
      } catch (error) {
        console.error("Error processing token:", error);
      }
    }
  }, 5000);

  useEffect(() => {
    if (location.latitude !== null && location.longitude !== null) {
      emitLocation(location);
    }
  }, [location]);

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
