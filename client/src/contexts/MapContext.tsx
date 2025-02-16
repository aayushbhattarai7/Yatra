import React, { createContext, useContext, useState } from "react";

export interface MarkerData {
  firstName: string;
  middleName?: string;
  lastName: string;
  latitude: number;
  longitude: number;
  photo: string;
}

interface MapContextType {
  markers: MarkerData[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkerData[]>>;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  return (
    <MapContext.Provider value={{ markers, setMarkers }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMapContext = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMapContext must be used within a MapProvider");
  }
  return context;
};
