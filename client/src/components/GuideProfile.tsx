import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Calendar,
  MapPin,
  Star,
  Award,
  Briefcase,
  RefreshCw,
  X,
} from "lucide-react";
import { GET_GUIDE_PROFILE } from "../mutation/queries";
import Button from "../ui/common/atoms/Button";
import { authLabel } from "@/localization/auth";
import { useLang } from "@/hooks/useLang";

interface UserData {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  gender: string;
  guiding_location: string | null;
  email: string;
  phoneNumber: string;
  createdAt: string;
  kyc: KYC[];
}

interface KYC {
  id: string;
  path: string;
}

interface GuideProfileUserViewProps {
  guideId?: string;
  isOpen: boolean;
  onClose: () => void;
}

const GuideProfileUserView = ({
  guideId,
  isOpen,
  onClose,
}: GuideProfileUserViewProps) => {
  const [user, setUser] = useState<UserData | null>(null);
  const { lang } = useLang();
  const { data, loading, error, refetch } = useQuery(GET_GUIDE_PROFILE, {
    variables: { guideId },
    skip: !guideId || !isOpen,
    onError: (error) => {
      console.error("Error fetching guide profile:", error.message);
    },
  });

  useEffect(() => {
    if (data?.getGuideProfile) {
      setUser(data.getGuideProfile);
    }
  }, [data]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center bg-white h-full">
          <div className="space-y-4">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-gray-100 h-24 w-24"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-6 bg-gray-100 rounded w-48"></div>
                <div className="h-4 bg-gray-100 rounded w-64"></div>
                <div className="h-4 bg-gray-100 rounded w-56"></div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center bg-white h-full p-4">
          <div className="text-center max-w-md">
            <div className="mb-6 text-red-500 mx-auto">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Failed to Load Guide Profile
            </h2>
            <p className="text-gray-500 mb-6">
              {error.message ||
                "We couldn't retrieve this guide's profile data. Please try again."}
            </p>
            <button
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all flex items-center justify-center gap-2"
              onClick={() => refetch()}
            >
              <RefreshCw className="w-4 h-4" />
              Retry
            </button>
          </div>
        </div>
      );
    }

    if (!user) {
      return (
        <div className="flex items-center justify-center bg-white h-full p-4">
          <div className="text-center max-w-md">
            <div className="mb-6 text-yellow-500 mx-auto">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              No Guide Profile Found
            </h2>
            Mail, Phone,
            <p className="text-gray-500 mb-6">
              We couldn't find a guide profile with the provided ID. Please
              check the guide ID and try again.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white h-full overflow-y-auto">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                Guide Profile
              </h1>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <motion.div whileHover={{ scale: 1.05 }}>
                  {user.kyc && user.kyc.length > 0 ? (
                    <img
                      className="w-24 h-24 rounded-full border-4 border-gray-50 hover:border-blue-500 transition-all object-cover"
                      src={user.kyc[0].path}
                      alt={`${user.firstName} ${user.lastName}`}
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-gray-50 bg-gray-200 flex items-center justify-center">
                      <User className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </motion.div>

                <div className="text-center md:text-left space-y-3">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                      {user.firstName} {user.middleName} {user.lastName}
                    </h1>
                    <p className="text-blue-600 font-medium">
                      Professional Tour Guide
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-gray-600 text-sm">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>
                        {user.guiding_location || "Location not specified"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-gray-600 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Not implemented yet</span>
                    </div>
                  </div>
                </div>

                <div className="md:ml-auto mt-4 md:mt-0">
                  <Button
                    buttonText={authLabel.booknow[lang]}
                    type="button"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all font-medium text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6 p-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="md:col-span-2 space-y-6"
              >
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h2 className="text-lg font-bold mb-3 text-gray-900">
                    About
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-sm">
                   Not implemented   </p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h2 className="text-lg font-bold mb-3 text-gray-900">
                    Expertise & Specialties
                  </h2>
                  <p>Not implemented</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h2 className="text-lg font-bold mb-3 text-gray-900">
                    Languages
                  </h2>
                 <p>Not implemented</p>
                </div>
              </motion.div>

              <div className="space-y-6">
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h2 className="text-lg font-bold mb-3 text-gray-900">
                    Guide Details
                  </h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                      <Briefcase className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-gray-500">Experience</div>
                        <div className="font-medium text-gray-900 text-sm">
                          5+ years
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <div>
                        <div className="text-xs text-gray-500">
                          Member Since
                        </div>
                        <div className="font-medium text-gray-900 text-sm">
                          {user.createdAt &&
                            new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8"
          >
            <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-end p-4 border-b">
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="flex-1 overflow-auto">{renderContent()}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GuideProfileUserView;
