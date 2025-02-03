import { useEffect, useState } from "react";
import { LogoutPopup } from "./LogoutPopup";
import { gql, useQuery } from "@apollo/client";
import { motion } from "framer-motion";
import { Settings, LogOut, Mail, Phone, User, Calendar } from "lucide-react";

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

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="space-y-4">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-full bg-gray-100  h-24 w-24"></div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded w-48"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-64"></div>
              <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-56"></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 p-4">
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Failed to Load Profile
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            We couldn't retrieve your profile data. Please try again.
          </p>
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all">
            Retry
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {logout && <LogoutPopup onClose={() => setLogout(false)} />}

      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
        >
          <div className="p-8 border-b border-gray-100 dark:border-gray-700">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <motion.div whileHover={{ scale: 1.05 }}>
                <img
                  className="w-32 h-32 rounded-full border-4 border-gray-50 dark:border-gray-700 hover:border-blue-500 transition-all"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="Profile"
                />
              </motion.div>

              <div className="text-center md:text-left space-y-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user?.firstName} {user?.middleName} {user?.lastName}
                </h1>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                    <Mail className="w-5 h-5 text-blue-500" />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300">
                    <Phone className="w-5 h-5 text-blue-500" />
                    <span>{user?.phoneNumber}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8 p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="p-6 bg-gray-50 dark:bg-gray-700/10 rounded-xl border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                  Profile Details
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Full Name
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {user?.firstName} {user?.middleName} {user?.lastName}
                      </div>
                    </div>
                    <User className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Gender
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white capitalize">
                        {user?.gender}
                      </div>
                    </div>
                    <User className="w-5 h-5 text-gray-400" />
                  </div>

                  <div className="flex justify-between items-center p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Member Since
                      </div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {new Date(user?.createdAt || "").toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </div>
                    </div>
                    <Calendar className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              <div className="p-6 bg-gray-50 dark:bg-gray-700/10 rounded-xl border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                  Account Actions
                </h2>
                <div className="space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700 text-gray-900 dark:text-white hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Settings className="w-5 h-5 text-blue-500" />
                      <span>Security Settings</span>
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
                    onClick={() => setLogout(false)}
                    className="w-full flex items-center justify-center gap-3 p-4 text-red-600 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-900/20 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Log Out
                  </motion.button>
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
