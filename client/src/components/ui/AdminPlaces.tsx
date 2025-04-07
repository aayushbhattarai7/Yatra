import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  X,
  Mountain,
  Star,
  Gauge,
  Navigation2,
  Plus,
  Route,
} from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import { useQuery } from "@apollo/client";
import { GET_PLACES_ADMIN } from "@/mutation/queries";
import PlaceLocation from "@/components/ui/PlaceLocation";
import AddPlaces from "@/components/ui/AddPlaces";
import "react-responsive-carousel/lib/styles/carousel.min.css";

interface Place {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: string;
  elevation: string;
  distance: string;
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
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLatitude, setUserLatitude] = useState<number>(0);
  const [userLongitude, setUserLongitude] = useState<number>(0);
  const [showMap, setShowMap] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<string | null>(null);
  const [showAddPlace, setShowAddPlace] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_PLACES_ADMIN);

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-100 text-red-800 p-4 rounded-lg">
          Error: {error.message}
        </div>
      </div>
    );
  }

  const PlaceCard = ({ place }: { place: Place }) => (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="relative h-48">
        {place.images[0] && (
          <img
            src={place.images[0].path}
            alt={place.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60" />
        <div className="absolute bottom-4 left-4">
          <h3 className="text-xl font-bold text-white">{place.name}</h3>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-blue-300" />
            <span className="text-sm text-blue-50">{place.location}</span>
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 rounded-full shadow-md">
          <span className="text-white font-semibold text-sm">{place.price}</span>
        </div>
      </div>

      <div className="p-4 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 px-2 py-1 rounded">
              <Gauge size={16} />
              <span className="text-sm font-medium">{place.difficulty}</span>
            </div>
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
              <Mountain size={16} className="text-gray-600" />
              <span className="text-sm text-gray-700">{place.elevation}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-gray-600">
          <div className="flex items-center gap-2">
            <Clock size={16} />
            <span className="text-sm">{place.duration}</span>
          </div>
          <div className="flex items-center gap-2">
            <Route size={16} />
            <span className="text-sm">{place.distance}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setPlaceDetails(place.id)}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
          >
            Trail Details
          </button>
          <button
            onClick={() => {
              setSelectedPlace(place);
              setShowMap(true);
            }}
            className="flex items-center justify-center gap-2 bg-white text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 border border-gray-200"
          >
            <Navigation2 size={16} />
            Map
          </button>
        </div>
      </div>
    </div>
  );

  const place = places.find((p) => p.id === placeDetails);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-1">Mountain Trails</h2>
            <p className="text-gray-600 font-medium">Discover breathtaking hiking adventures</p>
          </div>
          <button
            onClick={() => setShowAddPlace(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
          >
            <Plus size={20} />
            Add Trail
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>
      {placeDetails && place && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end md:items-center justify-center">
          <div className="bg-white w-full md:w-[700px] md:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <Carousel showArrows showStatus={false} showThumbs={false} infiniteLoop>
                {place.images.map((image) => (
                  <div key={image.id} className="h-64 md:h-80">
                    <img src={image.path} alt="Trail" className="w-full h-full object-cover" />
                  </div>
                ))}
              </Carousel>
              <button
                onClick={() => setPlaceDetails(null)}
                className="absolute top-4 right-4 bg-white p-2 rounded-full shadow-lg"
              >
                <X className="text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">{place.name}</h2>
                  <div className="flex items-center gap-1">
                    <Star className="text-amber-500" size={20} />
                    <span className="font-semibold">4.8</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">{place.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center bg-gray-50 p-3 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Elevation</div>
                    <div className="font-bold text-gray-800">{place.elevation}</div>
                  </div>
                  <div className="text-center bg-gray-50 p-3 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Distance</div>
                    <div className="font-bold text-gray-800">{place.distance}</div>
                  </div>
                  <div className="text-center bg-gray-50 p-3 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Duration</div>
                    <div className="font-bold text-gray-800">{place.duration}</div>
                  </div>
                  <div className="text-center bg-gray-50 p-3 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Price</div>
                    <div className="font-bold text-blue-700">{place.price}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium">
                    Book Adventure
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPlace(place);
                      setShowMap(true);
                      setPlaceDetails(null);
                    }}
                    className="flex items-center justify-center gap-2 bg-white text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-100 border border-gray-200"
                  >
                    <Navigation2 size={20} />
                    View on Map
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showMap && selectedPlace && (
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
      {showAddPlace && (
        <AddPlaces
          onClose={() => setShowAddPlace(false)}
         reload={()=>refetch()}
        />
      )}
    </div>
  );
};

export default Places;
