import { useEffect, useState, useCallback } from "react";
import {
  MapPin, Clock, X, Mountain, Star,
  Navigation2, Route, Heart, ChevronRight
} from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_PLACES_ADMIN,
  ADD_TO_FAVOURITE,
  GET_FAVOURITE,
  RATE_PLACE
} from "@/mutation/queries";
import PlaceLocation from "@/components/ui/PlaceLocation";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useLang } from "@/hooks/useLang";
import { authLabel } from "@/localization/auth";
import { showToast } from "../ToastNotification";

interface PlaceType {
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
  overallRating?: number;
}

interface Image {
  id: string;
  path: string;
}

const isVideo = (path: string) => {
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  return videoExtensions.some(ext => path.toLowerCase().endsWith(ext));
};

const Place = () => {
  const { lang } = useLang();
  const [places, setPlaces] = useState<PlaceType[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<PlaceType | null>(null);
  const [userLatitude, setUserLatitude] = useState<number>(0);
  const [userLongitude, setUserLongitude] = useState<number>(0);
  const [showMap, setShowMap] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showRatingModal, setShowRatingModal] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [ratingMessage, setRatingMessage] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_PLACES_ADMIN);
  const { data: favData, refetch: refetchFav } = useQuery(GET_FAVOURITE);
  const [addToFavourite] = useMutation(ADD_TO_FAVOURITE);
  const [ratePlace] = useMutation(RATE_PLACE);

  useEffect(() => {
    if (data?.getPlacesByAdmin) {
      setPlaces(data.getPlacesByAdmin);
    }
  }, [data]);

  useEffect(() => {
    if (favData?.getFavouritePlace) {
      const favSet = new Set<string>(
        favData.getFavouritePlace.map((fav: any) => fav.place.id)
      );
      setFavorites(favSet);
    }
  }, [favData]);

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

  const handleRateSubmit = async (placeId: string) => {
    try {
      const res = await ratePlace({
        variables: {
          id: placeId,
          rating,
          message: ratingMessage
        }
      });
      console.log("🚀 ~ handleRateSubmit ~ res:", res)
      
      setPlaces(places.map(place => 
        place.id === placeId 
          ? { ...place, rating } 
          : place
      ));
      refetch();
      setShowRatingModal("");
      setRating(0);
      showToast(res.data.ratePlace,"success");
    } catch (error:unknown) {
      if(error instanceof Error){
        showToast(error.message,"error")
      }
      console.error("Error submitting rating:", error);
    }
  };

  const toggleFavorite = useCallback(async (placeId: string) => {
    try {
      await addToFavourite({ variables: { placeId } });

      setFavorites((prev) => {
        const updated = new Set(prev);
        if (updated.has(placeId)) {
          updated.delete(placeId);
        } else {
          updated.add(placeId);
        }
        return updated;
      });

      await refetchFav();
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  }, [addToFavourite, refetchFav]);

  const RatingModal = ({ placeId }: { placeId: string }) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            {authLabel.ratingModalTitle[lang]}
          </h3>
          <button 
            onClick={() => setShowRatingModal("")}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {authLabel.ratingLabel[lang]}
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 rounded-full transition-colors ${
                  rating >= star ? 'text-yellow-400' : 'text-gray-300'
                }`}
              >
                <Star 
                  size={24} 
                  fill={rating >= star ? "currentColor" : "none"}
                  className="transition-all duration-200 hover:scale-110"
                />
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {authLabel.shareExperienceLabel[lang]}
          </label>
          <textarea
            value={ratingMessage}
            onChange={(e) => setRatingMessage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={4}
            placeholder={authLabel.ratingPlaceholder[lang]}
          />
        </div>
        <button
          onClick={() => handleRateSubmit(placeId)}
          disabled={!rating}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
            rating 
              ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {authLabel.submitRatingButton[lang]}
        </button>
      </div>
    </div>
  );

  const PlaceCard = ({ place }: { place: PlaceType }) => (
    <div className="group relative bg-white rounded-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 hover:shadow-xl">
      <div className="aspect-[4/3] overflow-hidden">
        {place.images[0] && (
          isVideo(place.images[0].path) ? (
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
          )
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      </div>
      
      <div className="absolute top-4 right-4">
        <button
          onClick={(e) => { 
            e.stopPropagation(); 
            toggleFavorite(place.id); 
          }}
          className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
        >
          <Heart 
            size={18} 
            className={favorites.has(place.id) ? "fill-red-500 stroke-red-500" : "text-white"} 
          />
        </button>
      </div>

      <div className="absolute bottom-0 inset-x-0 p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full">
            {place.difficulty}
          </div>
          {place.overallRating && (
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400" size={16} />
              <span className="text-white text-sm">{place.overallRating}</span>
            </div>
          )}
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
              <span className="text-white/90 text-sm">
                {place.elevation}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Route size={16} className="text-white/80" />
              <span className="text-white/90 text-sm">
                {place.distance}
              </span>
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

  const placeDetail = places.find((p) => p.id === placeDetails);

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-1">
            {authLabel.mountainTrailsTitle[lang]}
          </h2>
          <p className="text-gray-600 font-medium">
            {authLabel.mountainTrailsSubtitle[lang]}
          </p>
        </div>

        {places.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <PlaceCard key={place.id} place={place} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center text-gray-500">
            <img 
              src="https://images.unsplash.com/photo-1682686581854-5e71f58e7e3f" 
              alt={authLabel.noPlacesTitle[lang]} 
              className="w-40 h-40 mb-6 opacity-60 rounded-full object-cover" 
            />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              {authLabel.noPlacesTitle[lang]}
            </h3>
            <p className="text-gray-500 text-md">
              {authLabel.noPlacesSubtitle[lang]}
            </p>
          </div>
        )}
      </div>

      {placeDetails && placeDetail && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center overflow-hidden">
          <div className="bg-white w-full md:w-[800px] rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="relative h-[40vh]">
              <Carousel 
                showArrows={true} 
                showStatus={false} 
                showThumbs={false} 
                infiniteLoop 
                className="h-full"
                renderArrowPrev={(clickHandler, hasPrev) => (
                  hasPrev && (
                    <button
                      onClick={clickHandler}
                      className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
                    >
                      <ChevronRight size={24} className="text-white rotate-180" />
                    </button>
                  )
                )}
                renderArrowNext={(clickHandler, hasNext) => (
                  hasNext && (
                    <button
                      onClick={clickHandler}
                      className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors"
                    >
                      <ChevronRight size={24} className="text-white" />
                    </button>
                  )
                )}
              >
                {placeDetail.images.map((image) => (
                  <div key={image.id} className="h-[40vh]">
                    {isVideo(image.path) ? (
                      <video 
                        src={image.path} 
                        controls 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <img 
                        src={image.path} 
                        alt={placeDetail.name} 
                        className="w-full h-full object-cover" 
                      />
                    )}
                  </div>
                ))}
              </Carousel>
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
              
              <div className="absolute bottom-6 left-6">
                <h2 className="text-4xl font-bold text-white mb-2">{placeDetail.name}</h2>
                <div className="flex items-center gap-3">
                  {placeDetail.overallRating && (
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400" size={20} />
                      <span className="text-white font-medium">
                        {placeDetail.overallRating}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5">
                    <MapPin size={18} className="text-blue-400" />
                    <span className="text-white">{placeDetail.location}</span>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    toggleFavorite(placeDetail.id); 
                  }}
                  className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                >
                  <Heart 
                    size={20} 
                    className={favorites.has(placeDetail.id) ? "fill-red-500 stroke-red-500" : "text-white"} 
                  />
                </button>
                <button 
                  onClick={() => setPlaceDetails(null)} 
                  className="p-2 bg-black/20 backdrop-blur-md rounded-full hover:bg-black/40 transition"
                >
                  <X className="text-white" size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8">
              <div className="prose prose-lg max-w-none mb-8">
                <p className="text-gray-600">{placeDetail.description}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <Mountain className="text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-600">
                    {authLabel.detailsElevation[lang]}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {placeDetail.elevation}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <Route className="text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-600">
                    {authLabel.detailsDistance[lang]}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {placeDetail.distance}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <Clock className="text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-600">
                    {authLabel.detailsDuration[lang]}
                  </div>
                  <div className="text-lg font-bold text-gray-900">
                    {placeDetail.duration}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <MapPin className="text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-600">
                    {authLabel.detailsPrice[lang]}
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {placeDetail.price}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <button
                  onClick={() => setShowRatingModal(placeDetail.id)}
                  className="flex items-center justify-center gap-2 w-full bg-yellow-500 text-white py-3 px-6 rounded-xl hover:bg-yellow-600 transition shadow-lg shadow-yellow-500/20"
                >
                  <Star size={20} />
                  {authLabel.rateButton[lang]}
                </button>

                <button 
                  onClick={() => {
                    setSelectedPlace(placeDetail);
                    setShowMap(true);
                    setPlaceDetails(null);
                  }} 
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 px-6 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-600/20"
                >
                  <Navigation2 size={20} />
                  {authLabel.viewOnMapButton[lang]}
                </button>
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

      {showRatingModal && (
        <RatingModal placeId={showRatingModal} />
      )}
    </div>
  );
};

export default Place;
