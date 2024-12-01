import { gql, useQuery } from "@apollo/client";
import { useMessage } from "../../../contexts/MessageContext";
import { useEffect, useState } from "react";

const GET_GUIDE_QUERY = gql`
  query findGuides($id: String!) {
    findGuide(id: $id) {
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
  const { setMessage } = useMessage();
  const [guides, setGuides] = useState<FormData[] | null>(null);

  const { data, loading, error } = useQuery(GET_GUIDE_QUERY, {
    variables: { id: "c3f04b07-4db8-4d18-84d7-977170aecf28" },
  });

  useEffect(() => {
    if (data) {
      setGuides(data.findGuide); 
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
