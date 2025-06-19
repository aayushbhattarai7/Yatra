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
      {center ? (
        <MapContainer
          center={center}
          zoom={zoom}
          className="w-full h-[100vh] md:h-[910px] rounded-lg shadow-lg z-0"
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
                    class="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white shadow-lg"
                  />
                  <div class="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1.5 md:w-2 h-1.5 md:h-2 bg-blue-500 rounded-full"></div>
                </div>
              `,
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32],
            });

            return (
              <Marker
                key={prop.id}
                position={[prop.location.latitude, prop.location.longitude]}
                icon={customIcon}
              >
                <Popup className="leaflet-popup-custom">
                  <div className="text-center p-2">
                    <img
                      src={prop.image}
                      alt={`${prop.firstName}'s location`}
                      className="w-12 h-12 md:w-16 md:h-16 rounded-full mx-auto mb-2 border-2 border-gray-200"
                    />
                    <p className="font-semibold text-sm md:text-base">
                      {prop.firstName}
                      {prop.middleName && ` ${prop.middleName}`} {prop.lastName}
                    </p>
                    <p className="text-xs md:text-sm text-gray-600">
                      {prop.gender}
                    </p>
                    <div className="mt-2 flex gap-2 justify-center">
                      <Button
                        buttonText="Book Now"
                        className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        type="button"
                        onClick={() => setGuideId(prop.id)}
                      />
                      <Button
                        buttonText="View Details"
                        className="px-2 py-1 md:px-3 md:py-2 text-xs md:text-sm bg-gray-900 text-white rounded hover:bg-gray-700"
                        type="button"
                      />
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      ) : (
        <p className="text-center p-4">Fetching your location...</p>
      )}
      {guideId && (
        <RequestGuideBooking id={guideId} onClose={() => setGuideId("")} />
      )}
    </>
  );
};

export default GuideMap;
