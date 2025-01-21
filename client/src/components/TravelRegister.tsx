import {
  Bus,
  Search,
  Filter,
  Star,
  Wifi,
  History,
  MapPin,
  Home,
  BookOpen,
} from "lucide-react";
import React from "react";
import { TravelCard } from "./TravelCard";

import { Map } from "./Map";
export interface Travel {
  id: string;
  name: string;
  rating: number;
  vehicleType: string;
  seats: number;
  image: string;
  location: {
    lat: number;
    lng: number;
  };
}

const mockTravels: Travel[] = [
  {
    id: "1",
    name: "Itahari Tours and Travels",
    rating: 4.8,
    vehicleType: "Mercedes Vito",
    seats: 45,
    image:
      "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2069",
    location: { lat: 34.0522, lng: -118.2437 },
  },
  {
    id: "2",
    name: "Hamro Yatayat",
    rating: 3.5,
    vehicleType: "Mercedes Vito",
    seats: 45,
    image:
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&q=80&w=2071",
    location: { lat: 34.0622, lng: -118.2537 },
  },
  {
    id: "3",
    name: "Nagarik Yatayat",
    rating: 4.0,
    vehicleType: "Mercedes Vito",
    seats: 45,
    image:
      "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&q=80&w=2072",
    location: { lat: 34.0422, lng: -118.2337 },
  },
];

const TravelRegister = () => {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <div className="flex gap-6">
        <div className="w-2/5">
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Bus className="w-5 h-5 text-blue-600 flex-shrink-0" />
                Available Travels
              </h2>
              <div className="flex gap-2">
                <button className="filter-btn active">
                  <Wifi className="w-4 h-4 flex-shrink-0" />
                  <span className="ml-1.5">Online</span>
                </button>
                <button className="filter-btn">
                  <Filter className="w-4 h-4 flex-shrink-0" />
                  <span className="ml-1.5">All</span>
                </button>
                <button className="filter-btn">
                  <Star className="w-4 h-4 flex-shrink-0" />
                  <span className="ml-1.5">Top</span>
                </button>
              </div>
            </div>
            <div className="space-y-4">
              {mockTravels.map((travel) => (
                <TravelCard key={travel.id} travel={travel} />
              ))}
            </div>
          </div>
        </div>
        <div className="w-3/5 h-[calc(100vh-12rem)]">
          <Map travels={mockTravels} />
        </div>
      </div>
    </main>
  );
};

export default TravelRegister;
