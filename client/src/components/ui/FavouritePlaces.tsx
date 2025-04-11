import { useEffect, useState } from "react";
import {
  MapPin,
  Clock,
  X,
  Mountain,
  Star,
  Navigation2,
  Route,
  ChevronRight
} from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import { useQuery, useMutation, gql } from "@apollo/client";
import { REMOVE_FROM_FAVOURITE } from "@/mutation/queries";
import PlaceLocation from "@/components/ui/PlaceLocation";
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

const isVideo = (path: string) => {
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  return videoExtensions.some((ext) => path.toLowerCase().endsWith(ext));
};

const GET_FAVOURITE = gql`
 query GetFavouritePlace {
  getFavouritePlace {
  id
  user {
    id
  }  
  place {
    id
    latitude
    longitude
    duration
    location
    name
    price
   images {
    id
    path
   }
  }
  }
}
`;

const SavedPlace = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLatitude, setUserLatitude] = useState<number>(0);
  const [userLongitude, setUserLongitude] = useState<number>(0);
  const [showMap, setShowMap] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<string | null>(null);

  const { data, refetch } = useQuery(GET_FAVOURITE);
  const [removeFromFavourite] = useMutation(REMOVE_FROM_FAVOURITE);

  useEffect(() => {
    if (data?.getFavouritePlace) {
      const placeList = data.getFavouritePlace.map((fav: any) => fav.place);
      setPlaces(placeList);
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

  const handleRemoveFromFavourite = async (placeId: string) => {
    console.log("🚀 ~ handleRemoveFromFavourite ~ placeId:", placeId)
    try {
      await removeFromFavourite({ variables: { placeId } });
      refetch();
    } catch (err) {
      console.error(err);
    }
  };

  const PlaceCard = ({ place }: { place: Place }) => (
    <div className="group relative bg-white rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl">
      <div className="aspect-[4/3] overflow-hidden">
        {place.images[0] &&
          (isVideo(place.images[0].path) ? (
            <video
              src={place.images[0].path}
              muted
              autoPlay
              loop
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <img
              src={place.images[0].path}
              alt={place.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      </div>
      <div className="absolute top-4 right-4">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveFromFavourite(place.id);
          }}
          className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
        >
          <X size={18} className="text-white" />
        </button>
      </div>
      <div className="absolute bottom-0 inset-x-0 p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {place.difficulty}
          </div>
          <div className="flex items-center gap-1">
            <Star className="text-yellow-400" size={16} />
            <span className="text-white text-sm">4.8</span>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">{place.name}</h3>
        <div className="flex items-center gap-3 text-white/90 mb-4">
          <div className="flex items-center gap-1.5">
            <MapPin size={16} className="text-blue-400" />
            <span className="text-sm">{place.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={16} />
            <span className="text-sm">{place.duration}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Mountain size={16} className="text-white/80" />
              <span className="text-white/90 text-sm">{place.elevation}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Route size={16} className="text-white/80" />
              <span className="text-white/90 text-sm">{place.distance}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedPlace(place);
                setShowMap(true);
              }}
              className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
            >
              <Navigation2 size={18} className="text-white" />
            </button>
            <button
              onClick={() => setPlaceDetails(place.id)}
              className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
            >
              <ChevronRight size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const place = places.find((p) => p.id === placeDetails);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">Mountain Trails</h2>
          <p className="text-gray-600 font-medium">Discover breathtaking hiking adventures</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {places.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </div>
      </div>

      {placeDetails && place && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white w-full md:w-[800px] rounded-2xl overflow-hidden max-h-[90vh] shadow-2xl">
            <div className="relative h-96">
              <Carousel showArrows={false} showStatus={false} showThumbs={false} infiniteLoop>
                {place.images.map((image) => (
                  <div key={image.id} className="h-full">
                    {isVideo(image.path) ? (
                      <video src={image.path} controls className="w-full h-full object-cover" />
                    ) : (
                      <img src={image.path} alt={place.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                ))}
              </Carousel>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
              <div className="absolute bottom-6 left-6">
                <h2 className="text-4xl font-bold text-white mb-2">{place.name}</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400" size={20} />
                    <span className="text-white font-medium">4.8</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={18} className="text-blue-400" />
                    <span className="text-white">{place.location}</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFromFavourite(place.id);
                    setPlaceDetails(null);
                  }}
                  className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                >
                  <X size={20} className="text-white" />
                </button>
                <button
                  onClick={() => setPlaceDetails(null)}
                  className="p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition"
                >
                  <X className="text-white" size={20} />
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-600">{place.description}</p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <Mountain className="text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-600">Elevation</div>
                  <div className="text-lg font-bold text-gray-900">{place.elevation}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <Route className="text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-600">Distance</div>
                  <div className="text-lg font-bold text-gray-900">{place.distance}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <Clock className="text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="text-lg font-bold text-gray-900">{place.duration}</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <MapPin className="text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-600">Price</div>
                  <div className="text-lg font-bold text-blue-600">{place.price}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setSelectedPlace(place);
                  setShowMap(true);
                  setPlaceDetails(null);
                }}
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
              >
                <Navigation2 size={20} />
                View on Map
              </button>
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
    </div>
  );
};

export default SavedPlace;
