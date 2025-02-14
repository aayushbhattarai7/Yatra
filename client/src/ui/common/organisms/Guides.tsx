import RequestGuideBooking from "@/components/RequestGuideBooking";
import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Button from "../atoms/Button";
import { authLabel } from "@/localization/auth";
import { useLang } from "@/hooks/useLang";

const GET_GUIDE_QUERY = gql`
  query FindGuide {
    findGuide {
      id
      firstName
      middleName
      lastName
      guiding_location
      gender
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
}

interface Location {
  latitude: string;
  longitude: string;
}

const Guides = () => {
  const [guides, setGuides] = useState<FormData[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { lang } = useLang();
  const { data, loading, error } = useQuery(GET_GUIDE_QUERY);
  console.log(data, "jaja");
  useEffect(() => {
    if (data) {
      setGuides(data.findGuide);
      console.log(data, "ajja");
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {selectedId && (
        <RequestGuideBooking
          id={selectedId}
          onClose={() => setSelectedId(null)}
        />
      )}
      <div>
        {guides?.map((guide) => (
          <div key={guide.id}>
            <p>First Name: {guide.firstName}</p>
            <p>Middle Name: {guide.middleName}</p>
            <p>Last Name: {guide.lastName}</p>
            <p>Guiding Location: {guide.guiding_location}</p>
            <p>Gender: {guide.gender}</p>
            <Button
              type="button"
              buttonText={authLabel.book[lang]}
              onClick={() => setSelectedId(guide.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Guides;
