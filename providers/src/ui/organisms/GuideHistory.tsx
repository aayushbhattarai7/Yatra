import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_GUIDE_HISTORY } from "../../mutation/queries";
import Button from "../common/atoms/Button";
import { authLabel } from "../../localization/auth";
import { useLang } from "../../hooks/useLang";
import { MapPin, Calendar, Users, User, Clock, Star, Info } from "lucide-react";

interface FormData {
  id: string;
  from: string;
  to: string;
  totalPeople: string;
  totalDays: string;
  price: string;
  gender: string;
  status?: string;
  createdAt?: string;
  users: User;
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

const GuideHistory = () => {
  const [guides, setGuides] = useState<FormData[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { lang } = useLang();
  const { data, loading, error } = useQuery(GET_GUIDE_HISTORY);
  console.log("🚀 ~ GuideHistory ~ data:", data)

  useEffect(() => {
    if (data) {
      setGuides(data.getRequestHistoryOfGuide);
    }
  }, [data]);

  const renderStars = () => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 animate-spin">
            <Clock className="w-16 h-16 text-blue-500 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700">Loading...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Info className="w-16 h-16 text-red-500 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Error</h3>
          <p className="text-gray-500">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!guides || guides.length === 0) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Guide History
          </h3>
          <p className="text-gray-500">
            There are no guide bookings in your history yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Guide History</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {guides.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-semibold">
                    {request.users.firstName} {request.users.middleName}{" "}
                    {request.users.lastName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {request.users.nationality}
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
                {request.createdAt && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-b py-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Price</span>
                  <span className="font-semibold">
                    {request.price ? `Rs.${request.price}` : "Not set yet"}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-semibold ${
                      request.status === "COMPLETED"
                        ? "text-green-600"
                        : request.status === "CANCELLED"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {request.status || "PENDING"}
                  </span>
                </div>
              </div>

{request.status === "COMPLETED" && (

              <div className="mb-4">{renderStars()}</div>
)}

              <div className="space-y-2">
                <Button
                  buttonText={authLabel.details[lang]}
                  onClick={() => setSelectedId(request.id)}
                  type="button"
                  className="w-full bg-orange-500 border border-orange-600 text-emerald-600 hover:bg-orange-700 py-3 rounded-xl font-medium transition-colors disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400"
                />
             
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GuideHistory;