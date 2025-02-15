import React, { createContext, useContext, useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { jwtDecode } from "jwt-decode";
import { ADD_GUIDE_LOCATION, ADD_TRAVEL_LOCATION } from "../mutation/queries";
import { getCookie } from "../function/GetCookie";
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

  const [addLocationOfGuide] = useMutation(ADD_GUIDE_LOCATION);
  const [addLocationOfTravel] = useMutation(ADD_TRAVEL_LOCATION);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });

          try {
            const token = getCookie("accessToken")
            if (token) {
              const decodedToken: any = jwtDecode(token);
              console.log("🚀 ~ decodedToken:", decodedToken.role);
              const userRole = decodedToken.role;

              if (userRole === "TRAVEL") {
                await addLocationOfTravel({
                  variables: { latitude, longitude },
                });
              } else if (userRole === "GUIDE") {
                await addLocationOfGuide({
                  variables: { latitude, longitude },
                });
              }

            }
          } catch (error) {
            console.error("Error saving location:", error);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );

      return () => {
        navigator.geolocation.clearWatch(watchId);
      };
    } else {
    }
  }, [addLocationOfGuide, addLocationOfTravel]);

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
