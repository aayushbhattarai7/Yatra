import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Button from "../common/atoms/Button";
import { authLabel } from "../../localization/auth";
import { useLang } from "../../hooks/useLang";
import {
    GET_GUIDE_HISTORY,

} from "../../mutation/queries";

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

const GuideHistory = () => {
  const [guides, setGuides] = useState<FormData[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { lang } = useLang();
  const { data, loading, error } = useQuery(GET_GUIDE_HISTORY);

  useEffect(() => {
    if (data) {
      setGuides(data.getRequestHistoryOfGuide);
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
                  buttonText={authLabel.details[lang]}
                  onClick={() => setSelectedId(request.id)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No History yet</p>
      )}
    </>
  );
};

export default GuideHistory;
