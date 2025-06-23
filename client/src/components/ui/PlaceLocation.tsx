import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";

interface LocationData {
  latitude: number;
  longitude: number;
}

interface LocationProps {
  latitude: number;
  longitude: number;
  userLatitude: number;
  userLongitude: number;
  onClose: () => void;
}

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const RecenterMap = ({ latitude, longitude }: LocationData) => {
  const map = useMap();
  useEffect(() => {
    map.setView([latitude, longitude], 13);
  }, [latitude, longitude, map]);
  return null;
};

const PlaceLocation: React.FC<LocationProps> = ({
  latitude,
  longitude,
  userLatitude,
  userLongitude,
  onClose,
}) => {
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  console.log("🚀 ~ userLocation:", userLocation)

 
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

      },
      (error) => {
        console.error("Error getting user location:", error);
      },
    );
  }, [onClose]);

  const RoutingControl = () => {
    const map = useMap();

    useEffect(() => {
      const plan = new L.Routing.Plan(
        [L.latLng(userLatitude, userLongitude), L.latLng(latitude, longitude)],
        {
          createMarker: (i:any, waypoint:any) => {
            console.log(i);
            return L.marker(waypoint.latLng, {
              icon: markerIcon,
            });
          },
        },
      );

      const routingControl = L.Routing.control({
        plan,
        routeWhileDragging: true,
        lineOptions: {
          styles: [{ color: "blue", opacity: 0.6, weight: 4 }],
          extendToWaypoints: true,
          missingRouteTolerance: 30,
        },
      }).addTo(map);

      return () => {
        map.removeControl(routingControl);
      };
    }, [map, latitude, longitude, userLatitude, userLongitude]);

    return null;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg w-11/12 md:w-2/3 h-[500px] overflow-hidden z-50">
        <MapContainer
          center={[latitude, longitude]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[latitude, longitude]} icon={markerIcon}>
            <Popup>
              Place location: {latitude}, {longitude}
            </Popup>
          </Marker>

          <Marker position={[userLatitude, userLongitude]} icon={markerIcon}>
            <Popup>
              Your location: {userLatitude}, {userLongitude}
            </Popup>
          </Marker>

          <RoutingControl />
          <RecenterMap latitude={latitude} longitude={longitude} />
        </MapContainer>
      </div>
    </div>
  );
};

export default PlaceLocation;