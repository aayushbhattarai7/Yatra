import RequestGuideBooking from "@/components/RequestGuideBooking";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Button from "../atoms/Button";
import { authLabel } from "@/localization/auth";
import { useLang } from "@/hooks/useLang";
import GuideMap from "@/components/ui/GuideMap";

const GET_GUIDE_QUERY = gql`
  query FindGuide {
    findGuide {
      id
      firstName
      middleName
      lastName
      gender
      guiding_location
      location {
        latitude
        longitude
      }
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
  guiding_location: string;
  gender: string;
  location: Location;
  nationality: string;
  kyc: Kyc[];
}

interface Kyc {
  id: string;
  path: string;
}

interface Location {
  latitude: string;
  longitude: string;
}

const Guides = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const [guides, setGuides] = useState<FormData[] | null>(null);
  const { lang } = useLang();
  const { data, loading, error } = useQuery(GET_GUIDE_QUERY);
  console.log(data, "jaja");
  useEffect(() => {
    if (data) {
      setGuides(data.findGuide);
      console.log(data, "ajja");
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
          setUserLocation([28.3949, 84.124]);
        }
      );
    } else {
      setUserLocation([28.3949, 84.124]);
    }
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h2 style={{ padding: "1rem", fontSize: "1.25rem", fontWeight: "600" }}>
        Travels
      </h2>
      {guides && guides.length > 0 ? (
        <GuideMap
          props={guides.map((travel) => ({
            id: travel.id,
            firstName: travel.firstName,
            middleName: travel.middleName || "",
            lastName: travel.lastName,
            rating: 345,
            image: travel.kyc[0].path,
            location: {
              latitude: Number(travel.location.latitude),
              longitude: Number(travel.location.longitude),
            },
            gender: travel.gender,
          }))}
          center={userLocation!}
          zoom={12}
        />
      ) : (
        <p style={{ padding: "1rem", fontSize: "0.875rem" }}>
          No guide data available.
        </p>
      )}
    </div>
  );
};

export default Guides;
