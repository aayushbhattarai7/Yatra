import React, { createContext, useContext, useState } from "react";
import { LatLngTuple } from "leaflet";

interface MapContextProps {
  center: LatLngTuple;
  zoom: number;
  setCenter: (center: LatLngTuple) => void;
  setZoom: (zoom: number) => void;
}

const MapContext = createContext<MapContextProps | undefined>(undefined);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [center, setCenter] = useState<LatLngTuple>([27.7172, 85.324]);
  const [zoom, setZoom] = useState<number>(13);

  return (
    <MapContext.Provider value={{ center, zoom, setCenter, setZoom }}>
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
