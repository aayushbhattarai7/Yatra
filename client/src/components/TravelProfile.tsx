import React from 'react';
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, Calendar, Star, X } from "lucide-react";
import { GET_TRAVEL_PROFILE } from "../mutation/queries";
import Button from "../ui/common/atoms/Button";
import { authLabel } from "@/localization/auth";
import { useLang } from "@/hooks/useLang";

interface UserData {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
  vehicleType: string;
  kyc: KYC[];
}

interface KYC {
  id: string;
  path: string;
}

interface TravelProfileUserViewProps {
  travelId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const mockReviews = [
  {
    id: "1",
    name: "David",
    rating: 5,
    comment: "Very professional driver, made our journey comfortable!",
  },
  {
    id: "2",
    name: "Emma",
    rating: 4,
    comment: "Great service and very punctual.",
  },
  {
    id: "3",
    name: "Frank",
    rating: 5,
    comment: "Excellent driving skills and very friendly attitude!",
  },
];

const TravelProfileUserView = ({
  travelId,
  isOpen,
  onClose,
}: TravelProfileUserViewProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const { lang } = useLang();
  const { data, loading } = useQuery(GET_TRAVEL_PROFILE, {
    variables: { travelId },
    skip: !travelId || !isOpen,
  });

  useEffect(() => {
    if (data?.getTravelProfile) {
      setUser(data.getTravelProfile);
    }
  }, [data]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (loading || !user) {
      return (
        <div className="flex items-center justify-center h-full bg-white">
          <div className="text-gray-500">Loading...</div>
        </div>
      );
    }

    return (
      <div className="bg-white p-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div whileHover={{ scale: 1.05 }}>
            {user.kyc?.[0]?.path ? (
              <img
                src={user.kyc[0].path}
                alt="Travel"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-500"
              />
            ) : (
              <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-100">
                <User className="w-12 h-12 text-gray-400" />
              </div>
            )}
          </motion.div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {user.firstName} {user.middleName} {user.lastName}
            </h2>
            <p className="text-blue-600 text-sm">Professional Travel Partner</p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <MapPin className="w-4 h-4 text-blue-500" />
              {user.vehicleType || "Not Specified"}
            </div>
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
              <Calendar className="w-4 h-4 text-blue-500" />
              {new Date(user.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
          </div>

          <div className="flex items-center gap-1 text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-500" />
            ))}
            <span className="text-gray-700 ml-2">(4.8 / 95 reviews)</span>
          </div>

          <Button
            buttonText={authLabel.book[lang]}
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-all"
          />

          <div className="mt-6 w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">What Passengers Say</h3>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
              {mockReviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-gray-50 border rounded-lg p-3 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-1 text-yellow-500">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-500" />
                    ))}
                  </div>
                  <p className="text-gray-700 italic">"{review.comment}"</p>
                  <p className="text-sm text-gray-500 mt-1 text-right">— {review.name}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
              <div className="flex justify-end p-2 border-b">
                <button
                  onClick={onClose}
                  className="hover:bg-gray-100 p-2 rounded-full"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              {renderContent()}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TravelProfileUserView;