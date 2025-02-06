import { useLang } from "@/hooks/useLang";
import { authLabel } from "@/localization/auth";
import { SEND_PRICE_TO_GUIDE, USER_REQUESTS_FOR_GUIDE } from "@/mutation/queries";
import Button from "@/ui/common/atoms/Button";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { showToast } from "./ToastNotification";

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
interface Price {
  price: string;
}
const GuideBooking = () => {
    const [selectedId, setSelectedId] = useState<string | null>(null);
  const [guideBooking, setGuideBooking] = useState<GuideBooking[] | null>(null);
  const { data, loading, refetch} = useQuery(USER_REQUESTS_FOR_GUIDE);
  const { lang } = useLang()
    const [sendPriceToGuide] = useMutation(SEND_PRICE_TO_GUIDE);
    const { register, handleSubmit, reset } = useForm<Price>();
   const sendPrice: SubmitHandler<Price> = async (price) => {
     if (!selectedId) return;
     const res = await sendPriceToGuide({
       variables: { price: price.price, requestId: selectedId },
     });
     showToast(res.data.sendPriceToGuide, "success");
     reset();
     setSelectedId(null);
     refetch();
   };
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
                    <Button onClick={()=>setSelectedId(book.id)}
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
                <Button buttonText="Cancel" type="submit" />
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

export default GuideBooking;
