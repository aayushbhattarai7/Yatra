import { useEffect, useState } from "react";
import { useLang } from "@/hooks/useLang";
import { authLabel } from "@/localization/auth";
import {
  CANCEL_TRAVEL_REQUEST,
  SEND_PRICE_TO_TRAVEL,
  USER_REQUESTS_FOR_TRAVEL,
} from "@/mutation/queries";
import Button from "@/ui/common/atoms/Button";
import { useMutation, useQuery } from "@apollo/client";
import { SubmitHandler, useForm } from "react-hook-form";
import { showToast } from "./ToastNotification";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import InputField from "@/ui/common/atoms/InputField";
import Checkout from "./StripeCheckout";
import { Star, Clock, Phone, Mail, User } from "lucide-react";
import Esewa from "./Esewa";

interface TravelBooking {
  id: string;
  from: string;
  to: string;
  totalDays: string;
  totalPeople: string;
  travel: Travel;
  status: string;
  vehicleType: string;
  price: string;
  lastActionBy: string;
  userBargain: number;
  createdAt: string;
}

interface Travel {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
}

interface Price {
  price: string;
}

const TravelBooking = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [cancellationId, setCancellationId] = useState<string | null>(null);
  const [travelBooking, setTravelBooking] = useState<TravelBooking[] | null>(
    null
  );
  const [pay, setPay] = useState<boolean>(false);
  const { data, loading, refetch } = useQuery(USER_REQUESTS_FOR_TRAVEL);
  const { lang } = useLang();
  const [sendPriceToTravel] = useMutation(SEND_PRICE_TO_TRAVEL);
  const { register, handleSubmit, reset, setValue } = useForm<Price>();
  const [cancelTravelRequest] = useMutation(CANCEL_TRAVEL_REQUEST);

  const formatTimeDifference = (createdAt: string) => {
    if (!createdAt) return "Unknown time";
    const createdTime = new Date(createdAt).getTime();
    if (isNaN(createdTime)) return "Invalid date";

    const diffInSeconds = Math.floor((Date.now() - createdTime) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hrs ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    const diffInYears = Math.floor(diffInDays / 365);
    return `${diffInYears} years ago`;
  };

  const sendPrice: SubmitHandler<Price> = async (price) => {
    try {
      if (!selectedId) return;
      const res = await sendPriceToTravel({
        variables: { price: price.price, requestId: selectedId },
      });
      refetch();
      showToast(res.data.sendPriceToTravel, "success");
      reset();
      setSelectedId(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message || "An error occurred", "error");
      }
    }
  };

  const acceptRequest = async () => {
    setPay(true);
  };

  const CancelRequest = async () => {
    const res = await cancelTravelRequest({
      variables: { requestId: cancellationId },
    });
    reset();
    setCancellationId(null);
    refetch();
    showToast(res.data.cancelTravelRequest, "success");
  };

  useEffect(() => {
    if (data) {
      setTravelBooking(data.getOwnTravelRequest);
    }
  }, [data]);

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="w-5 h-5 text-yellow-400 fill-current" />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Travel Bookings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {travelBooking?.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {book.travel.firstName} {book.travel.middleName}{" "}
                    {book.travel.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Total People: {book.totalPeople}
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {book.status === "ACCEPTED"
                      ? book.travel.email
                      : " Display after booking is completed"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Display after booking is completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {formatTimeDifference(book.createdAt)}
                  </span>
                </div>
              </div>

              <div className="border-t border-b py-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Price Details</span>
                  <span className="font-semibold">
                    Rs. {book.price ? book.price : "Not set"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-semibold ${
                      book.status === "COMPLETED"
                        ? "text-green-600"
                        : book.status === "CANCELLED"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {book.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">{renderStars()}</div>

              <div className="space-y-2">
                {book.status === "CANCELLED" ? (
                  <p className="text-red-600 font-medium">Cancelled</p>
                ) : (
                  <div className="space-y-2">
                    {book.status === "COMPLETED" ? (
                      <Button
                        buttonText="Book Again"
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                      />
                    ) : (
                      <div className="space-y-2">
                        {book.lastActionBy === "TRAVEL" ? (
                          <>
                            {book.status !== "ACCEPTED" && (
                              <>
                                <Button
                                  onClick={acceptRequest}
                                  buttonText={authLabel.accept[lang]}
                                  type="submit"
                                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-md"
                                />
                                <Button
                                  onClick={() => setSelectedId(book.id)}
                                  buttonText={authLabel.bargain[lang]}
                                  disabled={book.userBargain > 2}
                                  type="submit"
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md disabled:bg-gray-400"
                                />
                              </>
                            )}
                          </>
                        ) : (
                          <Button
                            buttonText={authLabel.waiting[lang]}
                            disabled={loading}
                            type="submit"
                            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-2 rounded-md"
                          />
                        )}
                        <Button
                          buttonText="Cancel"
                          type="submit"
                          onClick={() => setCancellationId(book.id)}
                          className="w-full border bg-red-600 text-red-600 hover:bg-red-700 py-2 rounded-md"
                        />
                      </div>
                    )}
                  </div>
                )}
                <Button
                  buttonText="View Details"
                  type="button"
                  className="w-full border bg-blue-600 hover:bg-blue-700 py-2 rounded-md"
                />
              </div>
            </div>

            {pay && (
              <Esewa
                id={book.id}
                amounts={parseInt(book.price)}
              type="travel"
              />
            )}
          </div>
        ))}
      </div>

      {selectedId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Enter Price</h2>
            <form onSubmit={handleSubmit(sendPrice)}>
              <InputField
                register={register}
                setValue={setValue}
                type="text"
                name="price"
                className="border p-2 rounded-md w-full mb-4"
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

      {cancellationId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-white rounded-lg shadow-lg w-full max-w-sm mx-4"
          >
            <div className="flex justify-end p-2">
              <button
                onClick={() => setCancellationId(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <IoClose size={24} />
              </button>
            </div>
            <div className="px-6 pb-6">
              <h2 className="text-xl font-semibold mb-2">
                Are you sure you want to cancel this booking request?
              </h2>
              <p className="text-gray-600 mb-6">
                You won't be able to continue this request after cancellation.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancellationId(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  No
                </button>
                <button
                  onClick={CancelRequest}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Yes
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default TravelBooking;
