import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Data } from "@/types/Travels";
import Button from "@/ui/common/atoms/Button";
import RequestGuideBooking from "../RequestGuideBooking";

interface Props {
  props: Data[];
  center?: [number, number];
  zoom?: number;
}

const GuideMap: React.FC<Props> = ({ props, center = [0, 0], zoom = 10 }) => {
  const [guideId, setGuideId] = useState<string>("");

  return (
    <>
      <MapContainer
        center={center}
        zoom={zoom}
        className="w-full h-[600px] rounded-lg shadow-lg z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {props.map((prop) => {
          const customIcon = L.divIcon({
            className: "custom-marker",
            html: `
            <div class="relative">
              <img 
                src="${prop.image}" 
                alt="${prop.firstName}"
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
              key={prop.id}
              position={[prop.location.latitude, prop.location.longitude]}
              icon={customIcon}
            >
              <Popup>
                <div className="text-center">
                  <img
                    src={prop.image}
                    alt={`${prop.firstName}'s location`}
                    className="w-16 h-16 rounded-full mx-auto mb-2 border-2 border-gray-200"
                  />
                  <p className="font-semibold">
                    {prop.firstName}
                    {prop.middleName && ` ${prop.middleName}`} {prop.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{prop.gender}</p>
                  <div className="mt-2 flex gap-2 justify-center">
                    <Button
                      buttonText="Book Now"
                      className=""
                      type="button"
                      onClick={() => setGuideId(prop.id)}
                    />
                    
                    <Button
                      buttonText="View Details"
                      className=""
                      type="button"
                    />
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {guideId && guideId && (
        <RequestGuideBooking id={guideId} onClose={() => setGuideId("")} />
      )}
    </>
  );
};

export default GuideMap;
