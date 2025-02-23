import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_TRAVELS } from "@/mutation/queries";
import TravelMap from "./PlaceLocation";

interface FormData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  vehicleType: string;
  gender: string;
  location: Location;
  nationality: string;
  kyc: Kyc[];
}

interface Location {
  latitude: string;
  longitude: string;
}

interface Kyc {
  id: string;
  path: string;
}

const Travels: React.FC = () => {
  const [travels, setTravels] = useState<FormData[] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );

  const { data } = useQuery(GET_TRAVELS);
useEffect(() => {
  if (data?.findTravel) {
    setTravels(data.findTravel);
  }
}, [data]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } 
  }, []);
if (!data) {
  return <p style={{ padding: "1rem", fontSize: "0.875rem" }}>Loading...</p>;
}
return (
  <div>
    <h2 style={{ padding: "1rem", fontSize: "1.25rem", fontWeight: "600" }}>
      Travels
    </h2>
    {!travels || !userLocation ? (
      <p style={{ padding: "1rem", fontSize: "0.875rem" }}>Loading map...</p>
    ) : travels.length > 0 ? (
      <TravelMap
        props={travels.map((travel) => ({
          id: travel.id,
          firstName: travel.firstName,
          middleName: travel.middleName || "",
          lastName: travel.lastName,
          rating: 345,
          image: travel.kyc?.[0]?.path || "",
          location: {
            latitude: Number(travel.location?.latitude) || 0,
            longitude: Number(travel.location?.longitude) || 0,
          },
          gender: travel.gender,
        }))}
        center={userLocation}
        zoom={12}
      />
    ) : (
      <p style={{ padding: "1rem", fontSize: "0.875rem" }}>
        No travel data available.
      </p>
    )}
  </div>
);

};

export default Travels;
