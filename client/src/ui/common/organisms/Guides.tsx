import { gql, useQuery } from "@apollo/client";
import { useMessage } from "../../../contexts/MessageContext";
import { useEffect, useState } from "react";

const GET_GUIDE_QUERY = gql`
  query Query {
    findGuide {
      id
      firstName
      middleName
      lastName
      gender
      guiding_location
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
  const { setMessage } = useMessage();
  const [guides, setGuides] = useState<FormData[] | null>(null);

  const { data, loading, error } = useQuery(GET_GUIDE_QUERY);
console.log(data,"jaja")
  useEffect(() => {
    if (data) {
      setGuides(data.findGuide);
      console.log(data,"ajja")
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {guides?.map((guide) => (
        <div key={guide.id}>
          <p>ID: {guide.id}</p>
          <p>First Name: {guide.firstName}</p>
          <p>Middle Name: {guide.middleName}</p>
          <p>Last Name: {guide.lastName}</p>
          <p>Guiding Location: {guide.guiding_location}</p>
          <p>Gender: {guide.gender}</p>
        </div>
      ))}
    </div>
  );
};

export default Guides;
