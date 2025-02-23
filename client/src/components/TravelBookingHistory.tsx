import {
  USER_REQUESTS_FOR_TRAVEL,
  USER_TRAVEL_BOOKING_HISTORY,
} from "@/mutation/queries";
import Button from "@/ui/common/atoms/Button";
import { useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { NavLink } from "./ActiveNavLink";

interface TravelBooking {
  id: string;
  from: string;
  to: string;
  totalDays: string;
  totalPeople: string;
  travel: Travel;
  status: string;
}
interface Travel {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  vehicleType: string;
  gender: string;
}
const TravelBookingHistory = () => {
  const [travelBooking, setTravelBooking] = useState<TravelBooking[] | null>(
    null
  );
  const { data } = useQuery(USER_TRAVEL_BOOKING_HISTORY);
  console.log("🚀 ~ TravelBookingHistory ~ data:", data);

  useEffect(() => {
    if (data) setTravelBooking(data.getTravelHistory);
  });
  return (
    <>
      {travelBooking && travelBooking.length >0 ? (
        
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
            <p>Status: {book.status}</p>

            <Button buttonText="Re-Book" type="submit" />

            <Button buttonText="Details" type="button" />
          </div>
        ))}
      </div>
      ): (
          <p>No history available</p>
      )}
    </>
  );
};

export default TravelBookingHistory;
