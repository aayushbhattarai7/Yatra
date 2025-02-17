import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Travel } from "../types/Travels";

interface TravelMapProps {
  travels: Travel[];
  center?: [number, number];
  zoom?: number;
}

const TravelMap: React.FC<TravelMapProps> = ({
  travels,
  center = [0, 0],
  zoom = 10,
}) => {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-[600px] rounded-lg shadow-lg"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {travels.map((travel) => {
        const customIcon = L.divIcon({
          className: "custom-marker",
          html: `
            <div class="relative">
              <img 
                src="${travel.image}" 
                alt="${travel.firstName}"
                class="w-10 h-10 rounded-full border-2 border-white shadow-lg"
              />
              <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
            </div>
          `,
          iconSize: [40, 40],
          iconAnchor: [20, 40],
          popupAnchor: [0, -40],
        });

        return (
          <Marker
            key={travel.id}
            position={[travel.location.latitude, travel.location.longitude]}
            icon={customIcon}
          >
            <Popup>
              <div className="text-center">
                <img
                  src={travel.image}
                  alt={`${travel.firstName}'s location`}
                  className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-200"
                />
                <p className="font-semibold">
                  {travel.firstName}
                  {travel.middleName && ` ${travel.middleName}`}{" "}
                  {travel.lastName}
                </p>
                <p className="text-sm text-gray-600">
                  {travel.location.latitude.toFixed(4)},{" "}
                  {travel.location.longitude.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
};

export default TravelMap;
