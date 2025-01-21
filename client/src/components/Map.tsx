import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useMap } from '../contexts/MapContext';
import 'leaflet/dist/leaflet.css';
export interface Travel {
  id: string;
  name: string;
  rating: number;
  vehicleType: string;
  seats: number;
  image: string;
  location: {
    lat: number;
    lng: number;
  };
}
interface MapProps {
  travels: Travel[];
}

export const Map: React.FC<MapProps> = ({ travels }) => {
  const { center, zoom } = useMap();

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      className="w-full h-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {travels.map((travel) => (
        <Marker
          key={travel.id}
          position={[travel.location.lat, travel.location.lng]}
        >
          <Popup>
            <div className="text-sm">
              <h3 className="font-semibold">{travel.name}</h3>
              <p>{travel.vehicleType}</p>
              <p>{travel.seats} Seats Available</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};