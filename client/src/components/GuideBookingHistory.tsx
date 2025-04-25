import { useEffect, useState } from "react";
import { USER_GUIDE_BOOKING_HISTORY } from "@/mutation/queries";
import Button from "@/ui/common/atoms/Button";
import { useQuery } from "@apollo/client";
import { Star, MapPin, Calendar, Users, User, Clock } from "lucide-react";
import { formatTimeDifference } from "@/function/TimeDifference";
import RequestGuideBooking from "./RequestGuideBooking";

interface GuideBooking {
  id: string;
  from: string;
  to: string;
  totalDays: string;
  totalPeople: string;
  guide: Guide;
  status: string;
  createdAt: string;
}

interface Guide {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
}

const GuideBookingHistory = () => {
  const [guideBooking, setGuideBooking] = useState<GuideBooking[] | null>(
    null,
  );
  const [guideId, setGuideId] = useState<string>("");
  const { data } = useQuery(USER_GUIDE_BOOKING_HISTORY);

  useEffect(() => {
    if (data) setGuideBooking(data.getGuideHistory);
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

  if (!guideBooking || guideBooking.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Travel History
          </h3>
          <p className="text-gray-500">
            You haven't made any travel bookings yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Guide History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {guideBooking.map((book) => (
          <div
            key={book.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {book.guide.firstName} {book.guide.middleName}{" "}
                    {book.guide.lastName}
                  </h3>

                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-600">From: </span>
                    <span className="text-sm font-medium">{book.from}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-600">To: </span>
                    <span className="text-sm font-medium">{book.to}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-600">Duration: </span>
                    <span className="text-sm font-medium">
                      {book.totalDays} days
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <div>
                    <span className="text-sm text-gray-600">People: </span>
                    <span className="text-sm font-medium">
                      {book.totalPeople}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    {formatTimeDifference(book.createdAt)}
                  </span>
                </div>
              </div>

              <div className="border-t border-b py-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-semibold ${book.status === "COMPLETED"
                        ? "text-green-600"
                        : book.status === "CANCELLED"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}>
                    {book.status}
                  </span>
                </div>
              </div>
              <div className="mb-4">{renderStars()}</div>
              <div className="space-y-2">
                <Button
                  buttonText="Re-Book"
                  onClick={() => setGuideId(book.guide.id)}
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                />
                <Button
                  buttonText="View Details"
                  type="button"
                  className="w-full border border-gray-300 hover:bg-gray-50 py-2 rounded-md"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      {guideId && (
        <RequestGuideBooking id={guideId} onClose={() => setGuideId("")} />
      )}
    </div>
  );
};
export default GuideBookingHistory;
