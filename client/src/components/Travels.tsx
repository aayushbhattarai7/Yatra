import { authLabel } from "@/localization/auth";
import { gql, useQuery } from "@apollo/client";
import Button from "../ui/common/atoms/Button";
import { useEffect, useState } from "react";
import { useLang } from "@/hooks/useLang";
import RequestTravelBooking from "./RequestTravelBooking";

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
      kyc {
        id
        path
      }
    }
  }
`;

interface FormData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  vehicleType: string;
  gender: string;
  kyc: KYC[]
}
interface KYC{
  id: string;
  path: string;
}

const Travels = () => {
  const [travels, setTravels] = useState<FormData[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { lang } = useLang();

  const { data, loading, error } = useQuery(GET_TRAVEL_QUERY);
  console.log("🚀 ~ Travels ~ data:", data);

  useEffect(() => {
    if (data) {
      setTravels(data.findTravel);
    }
  }, [data]);
 
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {selectedId && (
        <RequestTravelBooking
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
      <div>
        {travels?.map((travel) => (
          <div key={travel.id}>
           <img src={travel.kyc[0]?.path} alt="jhjh" />
            <p>ID: {travel.id}</p>
            <p>First Name: {travel.firstName}</p>
            <p>Middle Name: {travel.middleName}</p>
            <p>Last Name: {travel.lastName}</p>
            <p>Vehicle: {travel.vehicleType}</p>
            <p>Gender: {travel.gender}</p>
            <Button
              type="button"
              buttonText={authLabel.book[lang]}
              onClick={() => setSelectedId(travel.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Travels;
