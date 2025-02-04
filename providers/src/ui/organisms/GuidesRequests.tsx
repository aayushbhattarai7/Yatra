import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import Button from "../common/atoms/Button";
import { authLabel } from "../../localization/auth";
import { useLang } from "../../hooks/useLang";
import {
  GUIDE_REQUESTS,
  REJECT_REQUEST_BY_GUIDE,
  SEND_PRICE_BY_GUIDE,
} from "../../mutation/queries";
import { SubmitHandler, useForm } from "react-hook-form";
import { showToast } from "../../components/ToastNotification";

interface FormData {
  id: string;
  from: string;
  to: string;
  totalPeople: string;
  totalDays: string;
  price: string;
  gender: string;
  users: User;
  lastActionBy:string
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

interface Price {
  price: string;
}

const GuideRequests = () => {
  const [guides, setGuides] = useState<FormData[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { lang } = useLang();
  const { data, loading, error, refetch } = useQuery(GUIDE_REQUESTS);
  const [rejectRequestByGuide] = useMutation(REJECT_REQUEST_BY_GUIDE);
  const [sendPriceByGuide] = useMutation(SEND_PRICE_BY_GUIDE);
  const { register, handleSubmit, reset } = useForm<Price>();

  const sendPrice: SubmitHandler<Price> = async (price) => {
    if (!selectedId) return;
    const res = await sendPriceByGuide({
      variables: { price: price.price, requestId: selectedId },
    });
    showToast(res.data.sendPriceByGuide, "success");
    reset();
    setSelectedId(null);
    refetch();
  };

  const rejectRequest = async (id: string) => {
    await rejectRequestByGuide({ variables: { requestId: id } });
    refetch();
  };

  useEffect(() => {
    if (data) {
      setGuides(data.getRequestsByGuide);
    }
  }, [data]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
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
              <p>{request.lastActionBy}</p>
              <div className="flex gap-5">

              {request.lastActionBy == "GUIDE" ? (
                <div className="flex gap-4">
                  {request.price === null ? (
                    <Button
                      type="button"
                      disabled={loading}
                      buttonText={authLabel.waiting[lang]}
                    />
                  ) : (
                    <Button
                      type="button"
                      disabled={loading}
                      buttonText={authLabel.waiting[lang]}
                    />
                  )}
                </div>
              ) : (
                <div className="flex gap-4">
                  {request.price === null ? (
                    <Button
                      type="button"
                      buttonText={authLabel.sendPrice[lang]}
                      onClick={() => setSelectedId(request.id)}
                    />
                  ) : (
                    <Button
                      type="button"
                      buttonText={authLabel.respond[lang]}
                    />
                  )}
                  <Button
                    type="button"
                    buttonText={authLabel.reject[lang]}
                    onClick={() => rejectRequest(request.id)}
                  />
                </div>
              )}
              <div>
                <Button
                  type="button"
                  buttonText={authLabel.reject[lang]}
                  onClick={() => rejectRequest(request.id)}
                />
              </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No requests yet</p>
      )}

      {selectedId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="mb-4">Enter Price</h2>
            <form onSubmit={handleSubmit(sendPrice)}>
              <input
                type="text"
                {...register("price", { required: true })}
                className="border p-2 rounded w-full mb-4"
                placeholder="Enter price"
              />
              <div className="flex gap-4">
                <Button type="submit" buttonText="Submit" />
                <Button
                  type="button"
                  buttonText="Cancel"
                  onClick={() => setSelectedId(null)}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default GuideRequests;
