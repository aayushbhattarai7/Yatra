import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useMapContext } from "@/contexts/MapContext";

const MapView: React.FC = () => {
  const { markers } = useMapContext();

  const defaultCenter: [number, number] = [34.0522, -118.2437];
  const zoom = 13;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={zoom}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.latitude, marker.longitude]}
          icon={L.icon({
            iconUrl: marker.photo,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
          })}
        >
          <Popup>
            <div className="text-center">
              <img
                src={marker.photo}
                alt={`${marker.firstName} ${marker.lastName}`}
                className="w-12 h-12 rounded-full mx-auto"
              />
              <p className="font-bold">
                {marker.firstName} {marker.middleName} {marker.lastName}
              </p>
              <p className="text-sm">
                Lat: {marker.latitude}, Lng: {marker.longitude}
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapView; 
