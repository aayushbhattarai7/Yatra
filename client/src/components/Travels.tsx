import React, { useEffect, useState } from "react";
import { Travel } from "../types/Travels";
import TravelMap from "./PlaceLocation";
import { useQuery } from "@apollo/client";
import { GET_TRAVELS } from "@/mutation/queries";
interface FormData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  vehicleType: string;
  gender: string;
  location: Location;
  nationality: string;
  kyc: Kyc[]
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

    const { data, loading, error } = useQuery(GET_TRAVELS);
 useEffect(() => {
   if (data) {
     setTravels(data.findTravel);
     console.log(data.findTravel, "ajja");
   }
 }, [data]);
  

return (
  <div>
    <h2 style={{ padding: "1rem", fontSize: "1.25rem", fontWeight: "600" }}>
      Travels
    </h2>
    {travels && travels.length > 0 ? (
      <TravelMap
        travels={travels.map((travel) => ({
          id: travel.id,
          firstName: travel.firstName,
          middleName: travel.middleName || "",
          lastName: travel.lastName,
          image: travel.kyc.length > 0 ? travel.kyc[0].path : "",
          location: {
            latitude: Number(travel.location.latitude),
            longitude: Number(travel.location.longitude),
          },
        }))}
        center={[20, 0]}
        zoom={2}
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
