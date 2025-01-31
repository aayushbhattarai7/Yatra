import React, { useEffect } from "react";
import {landingImage} from '../../config/constant/image'
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

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-[500px]">
        <img
          src={landingImage}
          alt="Mountain view from tent"
          className="w-full h-full object-cover"
        />
      

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
