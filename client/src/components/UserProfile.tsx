import { useEffect, useState } from "react";
import { LogoutPopup } from "./LogoutPopup";
import { gql, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { 
  LogOut, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Compass,
  Mountain,
  Settings,
  Camera
} from "lucide-react";
import { profileImage } from "@/config/constant/image";

interface UserData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  email: string;
  phoneNumber: string;
  createdAt: string;
}

const UserProfile = () => {
  const [logout, setLogout] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  const GET_USER_QUERY = gql`
    query GetUser {
      getUser {
        id
        firstName
        middleName
        lastName
        gender
        email
        phoneNumber
        createdAt
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_USER_QUERY);

  useEffect(() => {
    if (data?.getUser) {
      setUser(data.getUser);
    }
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-pulse space-y-8 w-full max-w-4xl p-4">
          <div className="h-64 bg-gray-100 rounded-3xl"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded-lg w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded-lg w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <div className="text-center max-w-md">
          <Mountain className="w-16 h-16 mx-auto text-red-500 mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Trail Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We've lost the path to your profile data. Let's try finding it again.
          </p>
          <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all">
            Retry Journey
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {logout && <LogoutPopup onClose={() => setLogout(false)} />}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          {/* Hero Banner */}
          <div className="h-[300px] rounded-3xl overflow-hidden relative mb-8">
            <img
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80"
              alt="Mountain landscape"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-end gap-6 flex-wrap">
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="relative"
                >
                  <img
                    src={profileImage}
                    alt="Profile"
                    className="w-24 h-24 md:w-32 md:h-32 rounded-2xl border-4 border-white shadow-lg"
                  />
                  <button className="absolute bottom-2 right-2 bg-white rounded-full p-1.5 shadow-lg">
                    <Camera className="w-4 h-4 text-gray-700" />
                  </button>
                </motion.div>
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {user?.firstName} {user?.middleName} {user?.lastName}
                  </h1>
                  <div className="flex flex-wrap gap-4">
                    <span className="flex items-center gap-1 text-sm">
                      <MapPin className="w-4 h-4" />
                      Adventure Seeker
                    </span>
                    <span className="flex items-center gap-1 text-sm">
                      <Compass className="w-4 h-4" />
                      Explorer Level 1
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="md:col-span-2 space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Mountain className="w-5 h-5 text-emerald-600" />
                    Explorer Details
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-500">Email</div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-emerald-600" />
                        {user?.email}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-500">Phone</div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-emerald-600" />
                        {user?.phoneNumber}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-500">Member Since</div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        {new Date(user?.createdAt || "").toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <div className="text-sm text-gray-500">Travel Style</div>
                      <div className="font-medium text-gray-900 flex items-center gap-2">
                        <Compass className="w-4 h-4 text-emerald-600" />
                        {user?.gender === 'male' ? 'Adventure Seeker' : 'Nature Explorer'}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Compass className="w-5 h-5 text-emerald-600" />
                    Quick Actions
                  </h2>
                  <div className="space-y-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5 text-emerald-600" />
                        <span>Account Settings</span>
                      </div>
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setLogout(true)}
                      className="w-full flex items-center justify-between p-4 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <LogOut className="w-5 h-5" />
                        <span>End Journey</span>
                      </div>
                    </motion.button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfile;