import React from 'react';
import { Star, Users, MapPin, BookOpen, ArrowRight } from 'lucide-react';
import { useMap } from '../contexts/MapContext';
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
interface TravelCardProps {
  travel: Travel;
}

export const TravelCard: React.FC<TravelCardProps> = ({ travel }) => {
  const { setCenter } = useMap();

  const handleViewProfile = () => {
    setCenter([travel.location.lat, travel.location.lng]);
  };

  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="w-48 min-w-[12rem] h-full">
        <img
          src={travel.image}
          alt={travel.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5 flex-1 flex flex-col justify-between min-h-[8rem]">
        <div className="flex justify-between items-start w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold leading-tight">{travel.name}</h3>
              <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0" />
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current flex-shrink-0" />
              <span className="ml-1.5 text-sm font-medium">{travel.rating}</span>
            </div>
          </div>
          <div className="flex items-center px-3 py-1.5 bg-gray-50 rounded-full">
            <Users className="w-4 h-4 text-gray-600 flex-shrink-0" />
            <span className="ml-1.5 text-sm font-medium text-gray-600">{travel.seats} Seats</span>
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="w-4 h-4 flex-shrink-0" />
            <span className="ml-2">{travel.vehicleType}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleViewProfile}
              className="inline-flex items-center px-4 h-9 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
            >
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="ml-1.5">View Profile</span>
            </button>
            <button className="inline-flex items-center px-4 h-9 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors duration-200">
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
              <span className="ml-1.5">Book Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};