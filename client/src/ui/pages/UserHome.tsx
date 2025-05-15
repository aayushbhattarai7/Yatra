import { useEffect, useState, useCallback } from "react";
import {
  MapPin, Clock, X, Mountain, Star,
  Navigation2, Route, Heart, ChevronRight, Mail, Phone,
  Instagram, Facebook, Twitter
} from "lucide-react";
import { Carousel } from "react-responsive-carousel";
import { useQuery, useMutation } from "@apollo/client";
import {
  GET_TOP_PLACES,
  GET_TOP_GUIDES,
  GET_TOP_TRAVELS,
  ADD_TO_FAVOURITE,
  GET_FAVOURITE,
  RATE_PLACE
} from "@/mutation/queries";
import PlaceLocation from "@/components/ui/PlaceLocation";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { homeImage } from "@/config/constant/image";
import { authLabel } from "@/localization/auth";
import { useLang } from "@/hooks/useLang";
import { useNavigate } from "react-router-dom";

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
  overallRating?: number;
}

interface Guide {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  gender: string;
  role: string;
  kyc: Image[];
}

interface Trek {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  role: string;
  gender: string;
  vehicleType: string;
  kyc: Image[];
}

interface Image {
  id: string;
  path: string;
  fileType: string;
}

const isVideo = (path: string) => {
  const videoExtensions = [".mp4", ".webm", ".ogg"];
  return videoExtensions.some(ext => path.toLowerCase().endsWith(ext));
};

function UserHome() {
  const [places, setPlaces] = useState<Place[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [treks, setTreks] = useState<Trek[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [userLatitude, setUserLatitude] = useState<number>(0);
  const [userLongitude, setUserLongitude] = useState<number>(0);
  const [showMap, setShowMap] = useState(false);
  const [placeDetails, setPlaceDetails] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showRatingModal, setShowRatingModal] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [ratingMessage, setRatingMessage] = useState("");
  const { lang } = useLang();
  const { data: placesData } = useQuery(GET_TOP_PLACES);
  const { data: guidesData } = useQuery(GET_TOP_GUIDES);
  console.log("🚀 ~ UserHome ~ guidesData:", guidesData)
  const { data: treksData } = useQuery(GET_TOP_TRAVELS);
  console.log("🚀 ~ UserHome ~ treksData:", treksData)
  const { data: favData, refetch: refetchFav } = useQuery(GET_FAVOURITE);
  const [addToFavourite] = useMutation(ADD_TO_FAVOURITE);
  const [ratePlace] = useMutation(RATE_PLACE);
 const navigate = useNavigate()
  useEffect(() => {
    if (placesData?.getTopPlaces) {
      setPlaces(placesData.getTopPlaces);
    }
  }, [placesData]);

  useEffect(() => {
    if (guidesData?.getTopGuidesByUser) {
      const filteredGuides = guidesData.getTopGuidesByUser.filter(
        (guide: Guide) => guide.role === 'GUIDE'
      );
      setGuides(filteredGuides);
    }
  }, [guidesData]);

  useEffect(() => {
    if (treksData?.getTopTravelsByUser) {
      const filteredTreks = treksData.getTopTravelsByUser.filter(
        (trek: Trek) => trek.role === 'TRAVEL'
      );
      setTreks(filteredTreks);
    }
  }, [treksData]);

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
      await ratePlace({
        variables: {
          id: placeId,
          rating,
          message: ratingMessage
        }
      });

      setPlaces(places.map(place =>
        place.id === placeId
          ? { ...place, rating }
          : place
      ));

      setShowRatingModal("");
      setRating(0);
      setRatingMessage("");
    } catch (error) {
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
          <h3 className="text-xl font-bold text-gray-900">Rate this place</h3>
          <button
            onClick={() => setShowRatingModal("")}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`p-2 rounded-full transition-colors ${rating >= star ? 'text-yellow-400' : 'text-gray-300'
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
            Share your experience
          </label>
          <textarea
            value={ratingMessage}
            onChange={(e) => setRatingMessage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            rows={4}
            placeholder="What did you think about this place?"
          />
        </div>
        <button
          onClick={() => handleRateSubmit(placeId)}
          disabled={!rating}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 ${rating
            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
        >
          Submit Rating
        </button>
      </div>
    </div>
  );

  const PlaceCard = ({ place }: { place: Place }) => (
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
    <div className="relative">
      <div className="relative h-[600px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${homeImage})`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>

        <div className="relative z-10 h-full flex flex-col items-center justify-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            {authLabel.homeSlogan[lang]}
          </h1>
          <p className="text-xl text-center mb-8 max-w-2xl">
            {authLabel.desc[lang]}          </p>
        </div>
      </div>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{authLabel.topDestination[lang]}</h2>
          <a href="/places" className="text-green-500 hover:text-green-600 flex items-center gap-1 font-medium">
            {authLabel.viewAll[lang]} <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="">
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
                alt="No Places"
                className="w-40 h-40 mb-6 opacity-60 rounded-full object-cover"
              />
              <h3 className="text-2xl font-semibold text-gray-700 mb-2">
                No Places to Show
              </h3>
              <p className="text-gray-500 text-md">
                Check back later or add new places to explore!
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto bg-gray-50">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{authLabel.popularTravels[lang]} </h2>
          <a href="#" className="text-green-500 hover:text-green-600 flex items-center gap-1 font-medium">
            {authLabel.viewAll[lang]}<ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {treks.map((trek) => (
            <div
              key={trek.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                {trek.kyc[0] && (
                  <img
                    src={trek.kyc[0].path}
                    alt={trek.firstName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800">
                    {`${trek.firstName} ${trek.middleName || ''} ${trek.lastName}`}
                  </h3>
                  <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full">
                    <span className="text-sm font-medium">{trek.role === "TRAVEL" ? authLabel.travel[lang] : authLabel.guide[lang]}</span>
                  </div>
                </div>
                <div className="flex gap-4 mb-4">
                  <div className="text-sm">
                    <span className="text-gray-500">{authLabel.gender[lang]}:</span>
                    <p className="font-medium text-gray-700">{trek.gender === "MALE" ? authLabel.male[lang] : authLabel.female[lang]}</p>
                  </div>
                  <div className="text-sm flex justify-end w-full">
                    <p className="font-medium text-gray-700">{trek.vehicleType}</p>
                  </div>
                </div>
                <button onClick={()=>navigate("/travel")} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors">
                  {authLabel.bookTravels[lang]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-4 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{authLabel.expertGuides[lang]} </h2>
          <a href="#" className="text-green-500 hover:text-green-600 flex items-center gap-1 font-medium">
            {authLabel.viewAll[lang]} <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {guides.map((guide) => (
            <div
              key={guide.id}
              className="bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <div className="h-32 w-32 rounded-full overflow-hidden mb-4 border-4 border-green-100">
                  {guide.kyc[0] && (
                    <img
                      src={guide.kyc[0].path}
                      alt={guide.firstName}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-1">
                  {`${guide.firstName} ${guide.middleName || ''} ${guide.lastName}`}
                </h3>
                <p className="text-green-600 font-medium mb-2">{guide.role === "TRAVEL" ? authLabel.travel[lang] : authLabel.guide[lang]}</p>
                <div className="flex items-center gap-1 mb-3">
                  <span className="text-sm font-medium">
                    {guide.gender === "MALE" ? authLabel.male[lang] : authLabel.female[lang]}
                  </span>
                </div>
                <button onClick={()=>navigate("/guide")} className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg transition-colors mt-4">
                  {authLabel.bookThisGuide[lang]}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="relative py-20">
        <div className="absolute inset-0 bg-green-700 opacity-90"></div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1464822759023-fed622ff2c3b)`,
          }}
        ></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-6">{authLabel.footerSlogan[lang]}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            {authLabel.footerSmallSlogan[lang]}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={()=>navigate("/travel")} className="bg-white text-green-700 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
              {authLabel.bookTravels[lang]}
            </button>
            <button onClick={()=>navigate("/guide")} className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-8 py-3 rounded-lg font-bold text-lg transition-colors">
              {authLabel.bookThisGuide[lang]}
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-xl font-bold mb-4">{authLabel.Yatra[lang]}</h3>
              <p className="text-gray-300 mb-4">
                {authLabel.yatraFooter[lang]}              </p>
              <div className="flex gap-4">
                <a href="#" className="text-white hover:text-green-400 transition-colors">
                  <Facebook className="h-6 w-6" />
                </a>
                <a href="#" className="text-white hover:text-green-400 transition-colors">
                  <Instagram className="h-6 w-6" />
                </a>
                <a href="#" className="text-white hover:text-green-400 transition-colors">
                  <Twitter className="h-6 w-6" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">{authLabel.destinations[lang]}</h4>
              <ul className="space-y-2">
                {places.map((place) => (

                  <li>
                    <a href="/places" className="text-gray-300 hover:text-green-400 transition-colors">
                      {place.name}
                    </a>
                  </li>
                ))}

              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">{authLabel.company[lang]}</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/about" className="text-gray-300 hover:text-green-400 transition-colors">
                    {authLabel.aboutUs[lang]}
                  </a>
                </li>
                <li>
                  <a href="/career" className="text-gray-300 hover:text-green-400 transition-colors">
                    {authLabel.Career[lang]}
                  </a>
                </li>

              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">{authLabel.careerCTAButtonContact[lang]}</h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-green-400 mt-0.5" />
                 
                    <a  className="text-gray-300" href="mailto:infos.yatra@gmail.com">infos.yatra@gmail.com</a>
                    
                </li>
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-green-400 mt-0.5" />
                  <a href="tel:+9779847194310" className="text-gray-300">
                    +9779847194310
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-green-400 mt-0.5" />
                  <span className="text-gray-300">{authLabel.address[lang]}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © {new Date().getFullYear()} Yatra. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 text-sm transition-colors">
                  Cookie Policy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {placeDetails && place && (
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
                {place.images.map((image) => (
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
                        alt={place.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                ))}
              </Carousel>

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />

              <div className="absolute bottom-6 left-6">
                <h2 className="text-4xl font-bold text-white mb-2">{place.name}</h2>
                <div className="flex items-center gap-3">
                  {place.overallRating && (
                    <div className="flex items-center gap-1">
                      <Star className="text-yellow-400" size={20} />
                      <span className="text-white font-medium">
                        {place.overallRating}
                      </span>
                    </div>
                  )}
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
                    toggleFavorite(place.id);
                  }}
                  className="p-2 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-colors"
                >
                  <Heart
                    size={20}
                    className={favorites.has(place.id) ? "fill-red-500 stroke-red-500" : "text-white"}
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
                <p className="text-gray-600">{place.description}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <Mountain className="text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-600">Elevation</div>
                  <div className="text-lg font-bold text-gray-900">
                    {place.elevation}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <Route className="text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-600">Distance</div>
                  <div className="text-lg font-bold text-gray-900">
                    {place.distance}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <Clock className="text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-600">Duration</div>
                  <div className="text-lg font-bold text-gray-900">
                    {place.duration}
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-2xl">
                  <MapPin className="text-blue-600 mb-2" size={24} />
                  <div className="text-sm text-gray-600">Price</div>
                  <div className="text-lg font-bold text-blue-600">
                    {place.price}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => setShowRatingModal(place.id)}
                  className="flex items-center justify-center gap-2 w-full bg-yellow-500 text-white py-3 px-6 rounded-xl hover:bg-yellow-600 transition shadow-lg shadow-yellow-500/20"
                >
                  <Star size={20} />
                  Rate this Place
                </button>

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
}
export default UserHome;