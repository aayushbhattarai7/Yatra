import { useLang } from "@/hooks/useLang";
import { authLabel } from "@/localization/auth";
import {
  CANCEL_TRAVEL_REQUEST,
  SEND_PRICE_TO_TRAVEL,
  USER_REQUESTS_FOR_TRAVEL,
} from "@/mutation/queries";
import Button from "@/ui/common/atoms/Button";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { showToast } from "./ToastNotification";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import InputField from "@/ui/common/atoms/InputField";

interface TravelBooking {
  id: string;
  from: string;
  to: string;
  totalDays: string;
  totalPeople: string;
  travel: Travel;
  travelStatus: string;
  vehicleType: string;
  userStatus: string;
  price: string;
  lastActionBy: string;
}
interface Travel {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
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
  const { data, loading, refetch } = useQuery(USER_REQUESTS_FOR_TRAVEL);
  const { lang } = useLang();
  const [sendPriceToTravel] = useMutation(SEND_PRICE_TO_TRAVEL);
  const { register, handleSubmit, reset, setValue } = useForm<Price>();
  const [cancelTravelRequest] = useMutation(CANCEL_TRAVEL_REQUEST);
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
        showToast(error.message || "An error occured", "error");
      }
    }
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
      console.log(data);
      setTravelBooking(data.getOwnTravelRequest);
    }
  });
  return (
    <>
      <div>
        {travelBooking?.map((book) => (
          <div className="border border-black flex mb-4 gap-20 items-center p-10">
            <p> id:{book.id}</p>
            <p>from : {book.from}</p>
            <p> to: {book.to}</p>
            <p>Total Days: {book.totalDays}</p>
            <p>Total People: {book.totalPeople}</p>
            <p>Price: {book.price}</p>
            <p className=" flex">
              Travel name:
              {book.travel.firstName} {book.travel.middleName}{" "}
              {book.travel.lastName}
            </p>
            <p>Status: {book.travelStatus}</p>
            {book.userStatus === "CANCELLED" ||
            book.travelStatus === "CANCELLED" ? (
              <p>Cancelled</p>
            ) : (
              <div>
                {book.travelStatus === "COMPLETED" ? (
                  <Button buttonText="Re-Book" type="submit" />
                ) : (
                  <div>
                    {book.lastActionBy === "TRAVEL" ? (
                      <div>
                        <Button
                          buttonText={authLabel.accept[lang]}
                          type="submit"
                        />
                        <Button
                          onClick={() => setSelectedId(book.id)}
                          buttonText={authLabel.bargain[lang]}
                          type="submit"
                        />
                      </div>
                    ) : (
                      <Button
                        buttonText={authLabel.waiting[lang]}
                        disabled={loading}
                        type="submit"
                      />
                    )}
                    <Button
                      buttonText="Cancel"
                      type="submit"
                      onClick={() => setCancellationId(book.id)}
                    />
                  </div>
                )}
              </div>
            )}
            <Button buttonText="Details" type="button" />
          </div>
        ))}
      </div>
      {selectedId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="mb-4">Enter Price</h2>
            <form onSubmit={handleSubmit(sendPrice)}>
              <InputField
                register={register}
                setValue={setValue}
                type="text"
                name="price"
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
    </>
  );
};

export default TravelBooking;
