import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import Button from "../common/atoms/Button";
import { authLabel } from "../../localization/auth";
import { useLang } from "../../hooks/useLang";
import {
  TRAVEL_REQUESTS,
  SEND_PRICE_BY_TRAEL,
  REJECT_REQUEST_BY_TRAVEL,
  REQUEST_FOR_COMPLETE_TRAVEL_SERVICE,
  ACCEPT_REQUEST_BY_TRAVEL,
} from "../../mutation/queries";
import { SubmitHandler, useForm } from "react-hook-form";
import { showToast } from "../../components/ToastNotification";
import { MapPin, Calendar, Users, User, Clock, MapPinned, AlertCircle, MoreVertical } from "lucide-react";
import { useSocket } from "../../contexts/SocketContext";
import Report from "../../components/Report";

interface FormData {
  id: string;
  from: string;
  to: string;
  totalPeople: string;
  totalDays: string;
  price: string;
  gender: string;
  user: User;
  lastActionBy: string;
  status: string;
}

interface User {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  location: Location;
  nationality: string;
}

interface Price {
  price: string;
}

const TravelRequests = () => {
  const [travels, setTravels] = useState<FormData[] | []>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { lang } = useLang();
  const { socket } = useSocket();
  const { data, loading, error, refetch } = useQuery(TRAVEL_REQUESTS);
  const [rejectRequestByTravel] = useMutation(REJECT_REQUEST_BY_TRAVEL);
  const [acceptRequestByTravel] = useMutation(ACCEPT_REQUEST_BY_TRAVEL);
  const [sendPriceByTravel] = useMutation(SEND_PRICE_BY_TRAEL);
  const { register, handleSubmit, reset } = useForm<Price>();
  const [requestForCompletedTravel] = useMutation(REQUEST_FOR_COMPLETE_TRAVEL_SERVICE);
  const [reportUserId, setReportUserId] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const sendPrice: SubmitHandler<Price> = async (price) => {
    try {
      if (!selectedId) return;
      const res = await sendPriceByTravel({
        variables: { price: price.price, requestId: selectedId },
      });
      showToast(res.data.sendPriceByTravel, "success");
      reset();
      setSelectedId(null);
      refetch();
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message || "An error occurred", "error");
        setSelectedId(null);
      }
    }
  };

  const rejectRequest = async (id: string) => {
    await rejectRequestByTravel({ variables: { requestId: id } });
    refetch();
  };
  const acceptRequest = async (id: string) => {
    await acceptRequestByTravel({ variables: { requestId: id } });
    refetch();
  };

  const requestForComplete = async (id: string) => {
    await requestForCompletedTravel({ variables: { userId: id } });
    refetch();
  };

  const handleReport = (userId: string) => {
    setReportUserId(userId);
    setActiveMenu(null);
  };

  useEffect(() => {
    if (data) {
      setTravels(data.getRequestByTravel);
    }
  }, [data]);

  useEffect(() => {
    const handleNewRequests = (newBooking: FormData) => {
      setTravels((prev) => [...prev, newBooking]);
    };

    socket.on("request-travel", handleNewRequests);
    return () => {
      socket.off("request-travel", handleNewRequests);
    };
  }, [socket]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Clock className="w-16 h-16 text-gray-300 mx-auto animate-spin" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700">
            Loading requests...
          </h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center text-red-600">
          <h3 className="text-xl font-semibold mb-2">Error</h3>
          <p>{error.message}</p>
        </div>
      </div>
    );
  }

  if (!travels || travels.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <MapPinned className="w-16 h-16 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Travel Requests
          </h3>
          <p className="text-gray-500">
            There are no pending travel requests at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Travel Requests</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {travels.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden relative"
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setActiveMenu(activeMenu === request.id ? null : request.id)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
              
              {activeMenu === request.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-1 z-10 border">
                  <button
                    onClick={() => handleReport(request.user.id)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <AlertCircle className="w-4 h-4" />
                    Report this user
                  </button>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {request.user.firstName} {request.user.middleName}{" "}
                    {request.user.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {request.user.nationality}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-600">From: </span>
                    <span className="text-sm font-medium">{request.from}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-600">To: </span>
                    <span className="text-sm font-medium">{request.to}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-600">Duration: </span>
                    <span className="text-sm font-medium">
                      {request.totalDays} days
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-600">People: </span>
                    <span className="text-sm font-medium">
                      {request.totalPeople}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-b py-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Price</span>
                  <span className="font-semibold">
                    {request.price || "Not set"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Action</span>
                  <span className="text-sm font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded">
                    {request.lastActionBy}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                {request.lastActionBy === "TRAVEL" ? (
                  <Button
                    type="button"
                    disabled={loading}
                    buttonText={authLabel.waiting[lang]}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md disabled:bg-gray-400"
                  />
                ) : (
                  <>
                    {request.price === null ? (
                      <Button
                        type="button"
                        buttonText={authLabel.sendPrice[lang]}
                        onClick={() => setSelectedId(request.id)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                      />
                    ) : (
                      <>
                        {request.status === "ACCEPTED" ? (
                          <Button
                            type="button"
                            buttonText={authLabel.complete[lang]}
                            onClick={() => requestForComplete(request.user.id)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
                          />
                        ) : (
                          <>
                            {!(request.status === "COMPLETED" || request.status === "CONFIRMATION_PENDING") && (
                              <>
                                <Button
                                  type="button"
                                  onClick={() => acceptRequest(request.id)}
                                  buttonText={authLabel.accept[lang]}
                                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-medium transition-colors"
                                  />
                                <Button
                                  type="button"
                                  onClick={() => setSelectedId(request.id)}
                                  buttonText={authLabel.bargain[lang]}
                                  className="w-full bg-orange-500 border border-orange-600 text-emerald-600 hover:bg-orange-700 py-3 rounded-xl font-medium transition-colors disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400"
                                  />
                                <Button
                                  type="button"
                                  buttonText={authLabel.reject[lang]}
                                  onClick={() => rejectRequest(request.id)}
                                  className="w-full bg-red-600 border border-red-700 text-emerald-600 hover:bg-red-700 py-3 rounded-xl font-medium transition-colors disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400"
                                />
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
                <Button
                  type="button"
                  buttonText={authLabel.details[lang]}
                  className="w-full bg-blue-600 border border-blue-700 text-emerald-600 hover:bg-blue-800 py-3 rounded-xl font-medium transition-colors disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400"
                  />
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Enter Price</h2>
            <form onSubmit={handleSubmit(sendPrice)}>
              <input
                type="text"
                {...register("price", { required: true })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                placeholder="Enter price"
              />
              <div className="flex gap-4">
                <Button
                  type="submit"
                  buttonText="Submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                />
                <Button
                  type="button"
                  buttonText="Cancel"
                  onClick={() => setSelectedId(null)}
                  className="flex-1 border border-gray-300 hover:bg-gray-50 py-2 rounded-md"
                />
              </div>
            </form>
          </div>
        </div>
      )}

      {reportUserId && (
        <Report 
          id={reportUserId} 
          type="travel" 
          onClose={() => setReportUserId(null)}
        />
      )}
    </div>
  );
};

export default TravelRequests;