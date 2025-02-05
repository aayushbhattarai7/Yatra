import { useLang } from "@/hooks/useLang";
import { authLabel } from "@/localization/auth";
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
  price: string
  lastActionBy:string
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
  const { data, loading } = useQuery(USER_REQUESTS_FOR_GUIDE);
  console.log("🚀 ~ TravelBookingHistory ~ data:", data);
const {lang} = useLang()
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
              <div>
                {book.lastActionBy === "GUIDE" ? (
                  <div>
                    <Button buttonText={authLabel.accept[lang]} type="submit" />
                      <Button buttonText={ authLabel.bargain[lang]} type="submit" />
                  </div>
                ) : (
                  <Button buttonText={authLabel.waiting[lang]} disabled={loading} type="submit" />
                )}
                <Button buttonText="Cancel" type="submit" />
              </div>
            )}
            <Button buttonText="Details" type="button" />
          </div>
        ))}
      </div>
    </>
  );
};

export default GuideBooking;
