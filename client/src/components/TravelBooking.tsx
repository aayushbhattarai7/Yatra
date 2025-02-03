import { USER_REQUESTS_FOR_TRAVEL } from "@/mutation/queries";
import Button from "@/ui/common/atoms/Button";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

interface TravelBooking {
  id: string;
  from: string;
  to: string;
  totalDays: string;
  totalPeople: string;
  travel: Travel;
  travelStatus: string;
}
interface Travel {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  vehicleType: string;
  gender: string;
}
const TravelBooking = () => {
  const [travelBooking, setTravelBooking] = useState<TravelBooking[] | null>(
    null
  );
  const { data, loading, error } = useQuery(USER_REQUESTS_FOR_TRAVEL);
  console.log("🚀 ~ TravelBookingHistory ~ data:", data);

  useEffect(() => {
    if (data) setTravelBooking(data.getOwnTravelRequest);
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
            <p className=" flex">
              Travels name:
              {book.travel.firstName} {book.travel.middleName}{" "}
              {book.travel.lastName}
            </p>
            <p>Status: {book.travelStatus}</p>
            {book.travelStatus === "COMPLETED" ? (
              <Button buttonText="Re-Book" type="submit" />
            ) : (
              <Button buttonText="Cancel" type="submit" />
            )}
            <Button buttonText="Details" type="button" />
          </div>
        ))}
      </div>
    </>
  );
};

export default TravelBooking;
