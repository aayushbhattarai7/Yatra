import { gql, useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Button from "../common/atoms/Button";
import { authLabel } from "../../localization/auth";
import { useLang } from "../../hooks/useLang";
import {
  GUIDE_REQUESTS,
  REJECT_REQUEST_BY_GUIDE,
} from "../../mutation/queries";
import { SubmitHandler } from "react-hook-form";

interface FormData {
  id: string;
  from: string;
  to: string;
  totalPeople: string;
  totalDays: string;
  price: string;
  gender: string;
  users: User;
}

interface User {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  guiding_location: string;
  gender: string;
  location: Location;
  nationality: string;
}

const GuideRequests = () => {
  const [guides, setGuides] = useState<FormData[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { lang } = useLang();
  const { data, loading, error } = useQuery(GUIDE_REQUESTS);
  console.log(data, "jaja");
  const [rejectRequestByGuide] = useMutation(REJECT_REQUEST_BY_GUIDE);

  const rejectRequest = async (id: string) => {
    const response = await rejectRequestByGuide({
      variables: { requestId: id! },
    });
    console.log(response.data);
  };
  useEffect(() => {
    if (data) {
      setGuides(data.getRequestsByGuide);
      console.log(data, "ajja");
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      {loading && <div>Loading...</div>}

      {!loading && !error && guides && guides.length > 0 ? (
        <div>
          {guides.map((request) => (
            <div key={request.id}>
              <p>From: {request.from}</p>
              <p>To: {request.to}</p>
              <p>Total People: {request.totalPeople}</p>
              <p>Total Days: {request.totalDays}</p>
              <p>Price: {request.price || "Not set yet"}</p>
              <p>
                User Name: {request.users.firstName} {request.users.middleName}{" "}
                {request.users.lastName}
              </p>
              <div className="flex gap-4">
                <Button
                  type="button"
                  buttonText={authLabel.respond[lang]}
                  onClick={() => setSelectedId(request.id)}
                />
                <Button
                  type="button"
                  buttonText={authLabel.reject[lang]}
                  onClick={() => rejectRequest(request.id)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No requests yet</p>
      )}
    </>
  );
};

export default GuideRequests;
