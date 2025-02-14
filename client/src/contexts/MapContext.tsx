import React, { createContext, useContext, ReactNode } from "react";
import { LatLngTuple } from "leaflet";

interface MapContextType {
  center: LatLngTuple;
  zoom: number;
  setCenter: (center: LatLngTuple) => void;
  setZoom: (zoom: number) => void;
}

const MapContext = createContext<MapContextType | undefined>(undefined);

export const MapProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [center, setCenter] = React.useState<LatLngTuple>([34.0522, -118.2437]); // Los Angeles
  const [zoom, setZoom] = React.useState(13);

  return (
    <MapContext.Provider value={{ center, zoom, setCenter, setZoom }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return context;
};
