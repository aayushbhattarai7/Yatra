import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

const GET_TRAVEL_QUERY = gql`
  query FindTravel {
    findTravel {
      id
      firstName
      middleName
      lastName
      gender
      available
      vehicleType
    }
  }
`;

interface FormData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  vehicle_type: string;
  gender: string;
  location: Location;
  nationality: string;
}

interface Location {
  latitude: string;
  longitude: string;
}

const Travels = () => {
  const [travels, setTravels] = useState<FormData[] | null>(null);

  const { data, loading, error } = useQuery(GET_TRAVEL_QUERY);
  useEffect(() => {
    if (data) {
      setTravels(data.findTravel);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {travels?.map((travel) => (
        <div key={travel.id}>
          <p>ID: {travel.id}</p>
          <p>First Name: {travel.firstName}</p>
          <p>Middle Name: {travel.middleName}</p>
          <p>Last Name: {travel.lastName}</p>
          <p>Vehicle: {travel.vehicle_type}</p>
          <p>Gender: {travel.gender}</p>
        </div>
      ))}
    </div>
  );
};

export default Travels;
