import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

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
        }
      );
    } 
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

   return (
     <div>
       <h2 className="p-4 text-xl font-semibold">Guides</h2>
       {!userLocation ? (
         <p className="text-center py-4">Loading map...</p>
       ) : guides && guides.length > 0 ? (
         <GuideMap
           props={guides.map((guide) => ({
             id: guide.id,
             firstName: guide.firstName,
             middleName: guide.middleName || "",
             lastName: guide.lastName,
             rating: 345,
             image: guide.kyc.length > 0 ? guide.kyc[0].path : "",
             location: {
               latitude: Number(guide.location.latitude),
               longitude: Number(guide.location.longitude),
             },
             gender: guide.gender,
           }))}
           center={userLocation}
           zoom={12}
         />
       ) : (
         <p className="p-4 text-sm">No guide data available.</p>
       )}
     </div>
   );
};

export default Guides;
