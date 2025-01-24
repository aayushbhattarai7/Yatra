import React, { useEffect } from "react";
import {
  MapPin,
  Users,
  Calendar,
  Compass,
  Bell,
  ShoppingCart,
} from "lucide-react";
import { getCookie } from "@/function/GetCookie";
import { useNavigate } from "react-router-dom";

function UserHome() {
  const navigate = useNavigate();
  const isLoggedIn = !!getCookie("accessToken");
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/landing");
    }
  }, [isLoggedIn, navigate]);
  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[500px]">
        <img
          src="https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          alt="Mountain view from tent"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white">
          <h1 className="text-5xl font-bold mb-4">Discover the</h1>
          <h2 className="text-5xl font-bold mb-4">most engaging</h2>
          <h2 className="text-5xl font-bold">places</h2>
        </div>

        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-6 mx-4">
            <div className="grid grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 border-r pr-4">
                <MapPin className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm text-gray-500">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="Where are you going?"
                    className="block w-full text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 border-r pr-4">
                <Users className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm text-gray-500">Travels</label>
                  <input
                    type="text"
                    placeholder="Find Guides"
                    className="block w-full text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 border-r pr-4">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm text-gray-500">Dates</label>
                  <input
                    type="text"
                    placeholder="Add date"
                    className="block w-full text-sm focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Compass className="w-5 h-5 text-gray-400" />
                <div>
                  <label className="block text-sm text-gray-500">Guides</label>
                  <input
                    type="text"
                    placeholder="Find Guides"
                    className="block w-full text-sm focus:outline-none"
                  />
                </div>
                <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
