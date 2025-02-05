import { USER_REQUESTS_FOR_GUIDE } from "@/mutation/queries";
import Button from "@/ui/common/atoms/Button";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";

interface GuideBooking {
  id: string;
  from: string;
  to: string;
  totalDays: string;
  totalPeople: string;
  guide: Guide;
  guideStatus: string;
  price:string
}
interface Guide {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
}
const GuideBooking = () => {
  const [guideBooking, setGuideBooking] = useState<GuideBooking[] | null>(null);
  const { data } = useQuery(USER_REQUESTS_FOR_GUIDE);
  console.log("🚀 ~ TravelBookingHistory ~ data:", data);

  useEffect(() => {
    if (data) setGuideBooking(data.getOwnGuideRequest);
  });
  return (
    <>
      <div>
        {guideBooking?.map((book) => (
          <div className="border border-black flex mb-4 gap-20 items-center p-10">
            <p> id:{book.id}</p>
            <p>from : {book.from}</p>
            <p> to: {book.to}</p>
            <p>Total Days: {book.totalDays}</p>
            <p>Total People: {book.totalPeople}</p>
            <p>Price: {book.price}</p>
            <p className=" flex">
              Guides name:
              {book.guide.firstName} {book.guide.middleName}{" "}
              {book.guide.lastName}
            </p>
            <p>Status: {book.guideStatus}</p>
            {book.guideStatus === "COMPLETED" ? (
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

export default GuideBooking;
