import { useEffect, useState } from "react";
import { MapPin, Clock, X, DollarSign, Star, ChevronDown, ChevronUp, Camera, Users, Navigation2, Bus } from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import { motion, AnimatePresence } from "framer-motion";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Button from "@/ui/common/atoms/Button";
import PlaceLocation from "@/components/ui/PlaceLocation";
import { useQuery } from "@apollo/client";
import { GET_PLACES_ADMIN } from "@/mutation/queries";

interface Place {
  id: string;
  name: string;
  description: string;
  duration: string;
  location: string;
  latitude: string;
  longitude: string;
  price: string;
  images: Image[];
}

interface Image {
  id: string;
  path: string;
}

const Places = () => {
  const [activeTab, setActiveTab] = useState<"featured" | "all">("featured");
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userLatitude, setUserLatitude] = useState<number>(0);
  const [userLongitude, setUserLongitude] = useState<number>(0);
  const [showMobileList, setShowMobileList] = useState(true);
  const [showMap, setShowMap] = useState(true);
  const [placeDetails, setPlaceDetails] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_PLACES_ADMIN);

  useEffect(() => {
    if (data?.getPlacesByAdmin) {
      setPlaces(data.getPlacesByAdmin);
    }
  }, [data]);

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setUserLatitude(position.coords.latitude);
          setUserLongitude(position.coords.longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-indigo-50 to-cyan-50">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-t-4 border-b-4 border-indigo-600 animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-12 w-12 rounded-full border-t-4 border-b-4 border-cyan-500 animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Places</h2>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  const PlaceCard = ({ place }: { place: Place }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-100 hover:shadow-muted transition-all duration-300"
    >
      <div className="flex items-center p-4 border-b border-slate-100">
        <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-orange-400 rounded-xl flex items-center justify-center shadow-md">
          <Bus className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4 flex-1">
          <h3 className="text-lg font-semibold text-slate-800">{place.name}</h3>
          <div className="flex items-center mt-1">
            <Star className="w-4 h-4 text-amber-400" fill="currentColor" />
            <span className="text-sm font-medium text-slate-600 ml-1">4.8</span>
            <span className="mx-2 text-slate-300">•</span>
            <Users className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-600 ml-1">45 Seats</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-semibold text-emerald-600">{place.price}</span>
          <span className="text-xs text-slate-500 mt-1">per person</span>
        </div>
      </div>

      <div className="p-4">
        <div className="space-y-3 mb-4">
          <div className="flex items-center text-slate-600">
            <MapPin className="w-5 h-5 mr-2 text-rose-500" />
            <span className="text-sm">{place.location}</span>
          </div>
          <div className="flex items-center text-slate-600">
            <Clock className="w-5 h-5 mr-2 text-cyan-500" />
            <span className="text-sm">{place.duration}</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2">

          <Button
            type="button"
            buttonText="Details"
            onClick={() => setPlaceDetails(place.id)}
            name="profile"
            className="flex-1 border-2 border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-50/50 transition-all duration-300"
          />
          <Button
            type="button"
            buttonText="Map"
            onClick={() => {
              setSelectedPlace(place);
              setShowMap(true);
            }}
            icon={<Navigation2 className="w-4 h-4" />}
            name="map"
            className="bg-slate-50/80 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-slate-100/50 transition-all duration-300"
          />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-stone-">
      <div className="hidden md:flex h-screen">
        <div className="w-1/3 p-8 overflow-y-auto border-r border-slate-200/50 bg-white/80 backdrop-blur-lg">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Cultural Journeys
          </h2>
          <p className="text-slate-600 mb-8">Discover authentic experiences</p>
          
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "featured" 
                  ? "bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-100" 
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              Featured Tours
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeTab === "all" 
                  ? "bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-100" 
                  : "bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              All Tours
            </button>
          </div>

          <div className="space-y-4">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>

        <div className="w-2/3 relative bg-slate-50">
          {selectedPlace && showMap && (
            <PlaceLocation
              latitude={parseFloat(selectedPlace.latitude)}
              longitude={parseFloat(selectedPlace.longitude)}
              userLatitude={userLatitude}
              userLongitude={userLongitude}
              onClose={() => {
                setSelectedPlace(null);
                setShowMap(false);
              }}
            />
          )}
        </div>
      </div>

      <div className="md:hidden">
        <div className="relative h-[40vh] bg-slate-100 rounded-b-3xl overflow-hidden">
          {selectedPlace && showMap && (
            <PlaceLocation
              latitude={parseFloat(selectedPlace.latitude)}
              longitude={parseFloat(selectedPlace.longitude)}
              userLatitude={userLatitude}
              userLongitude={userLongitude}
              onClose={() => {
                setSelectedPlace(null);
                setShowMap(false);
              }}
            />
          )}
        </div>

        <div className="p-4 pt-6 bg-white/90 backdrop-blur-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-1">
            Cultural Journeys
          </h2>
          <p className="text-slate-600 mb-6">Discover authentic experiences</p>
          
          <div className="flex gap-3 mb-6 overflow-x-auto pb-2 no-scrollbar">
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === "featured" 
                  ? "bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-100/50" 
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              Featured Tours
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap ${
                activeTab === "all" 
                  ? "bg-gradient-to-br from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-100/50" 
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              All Tours
            </button>
          </div>

          <div className="space-y-4">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {placeDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={() => setPlaceDetails(null)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 20, stiffness: 200 }}
              className="absolute bottom-0 inset-x-0 bg-white rounded-t-3xl overflow-hidden"
              style={{ maxHeight: "90vh" }}
              onClick={e => e.stopPropagation()}
            >
              <div className="relative">
                <div className="w-16 h-1 bg-slate-300 rounded-full mx-auto my-4" />
                
                <div className="relative h-48 bg-slate-100">
                  {places.find(p => p.id === placeDetails)?.images && (
                    <Carousel
                      showArrows={true}
                      showStatus={false}
                      showThumbs={false}
                      infiniteLoop={true}
                      className="full-height-slider"
                    >
                      {places.find(p => p.id === placeDetails)?.images.map((image) => (
                        <div key={image.id} className="h-48">
                          <img
                            src={image.path}
                            alt="Place"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </Carousel>
                  )}
                  <button
                    onClick={() => setPlaceDetails(null)}
                    className="absolute top-4 right-4 z-10 bg-white/90 rounded-full p-2 hover:bg-white transition-colors shadow-sm"
                  >
                    <X className="w-5 h-5 text-slate-700" />
                  </button>
                </div>

                <div className="p-6 pt-4">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-2xl font-bold text-slate-900">
                      {places.find(p => p.id === placeDetails)?.name}
                    </h2>
                    <div className="flex items-center bg-amber-50/80 px-3 py-1 rounded-full border border-amber-100">
                      <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
                      <span className="text-sm font-semibold text-amber-600 ml-1.5">4.8</span>
                    </div>
                  </div>
                  
                  <p className="text-slate-600 text-base leading-relaxed mb-6">
                    {places.find(p => p.id === placeDetails)?.description}
                  </p>
                  
                  <div className="space-y-3.5 mb-6">
                    <div className="flex items-center text-slate-700">
                      <MapPin className="w-5 h-5 mr-3 text-rose-500" />
                      <span className="text-base">{places.find(p => p.id === placeDetails)?.location}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <Clock className="w-5 h-5 mr-3 text-cyan-500" />
                      <span className="text-base">{places.find(p => p.id === placeDetails)?.duration}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <DollarSign className="w-5 h-5 mr-3 text-emerald-500" />
                      <span className="text-base">{places.find(p => p.id === placeDetails)?.price}</span>
                    </div>
                    <div className="flex items-center text-slate-700">
                      <Users className="w-5 h-5 mr-3 text-indigo-500" />
                      <span className="text-base">45 Seats Available</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      type="button"
                      buttonText="Book Now"
                      onClick={() => {}}
                      name="book"
                      className="w-full bg-gradient-to-br from-indigo-600 to-violet-500 text-white py-3.5 rounded-xl text-base font-semibold hover:shadow-lg transition-all duration-300"
                    />
                    <Button
                      type="button"
                      buttonText="View on Map"
                      onClick={() => {
                        const place = places.find(p => p.id === placeDetails);
                        if (place) {
                          setSelectedPlace(place);
                          setShowMap(true);
                        }
                        setPlaceDetails(null);
                      }}
                      icon={<Navigation2 className="w-5 h-5" />}
                      name="map"
                      className="w-full border-2 border-slate-200 text-slate-700 py-3.5 rounded-xl text-base font-semibold hover:bg-slate-50/50 transition-all duration-300"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Places;