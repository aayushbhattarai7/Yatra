import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_TRAVELS } from "../mutation/queries";
import TravelMap from "./PlaceLocation";
import RequestTravelBooking from "./RequestTravelBooking";
import Button from "@/ui/common/atoms/Button";
import { authLabel } from "@/localization/auth";
import { useLang } from "@/hooks/useLang";
import { useSocket } from "@/contexts/SocketContext";

interface FormData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  vehicleType: string;
  gender: string;
  location: Location;
  nationality: string;
  kyc: Kyc[];
}

interface Location {
  latitude: string;
  longitude: string;
}

interface Kyc {
  id: string;
  path: string;
}

const Travels = () => {
  const [activeTab, setActiveTab] = useState<"online" | "all">("online");
  const [travels, setTravels] = useState<FormData[] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const {socket} = useSocket()
  const [showMobileList, setShowMobileList] = useState(true);
  const { lang } = useLang();
  const [travelId, setTravelId] = useState<string>("");

  const { data, loading, error } = useQuery(GET_TRAVELS);
  console.log("🚀 ~ Travels ~ data:", data)

  useEffect(() => {
    console.log(error,"hahah")
    if (data?.findTravel) {
      console.log("🚀 ~ useEffect ~ data:", data)
      setTravels(data.findTravel);
    }
  }, [data]);

  useEffect(()=>{
  socket.on("travels", (addLocation: { id: string; location: { latitude: string; longitude: string } }) => {
console.log("Location updated")
    setTravels((prevTravels) =>
      prevTravels?.map((travel) =>
        travel.id === addLocation.id
          ? {
              ...travel,
              location: {
                latitude: addLocation.location.latitude,
                longitude: addLocation.location.longitude,
              },
            }
          : travel
      ) || null
    );
  });

  },[socket])

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.latitude,
            position.coords.longitude,
          ]);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-gray-50">
      <div className="hidden md:flex h-full">
        <div className="w-1/3 p-6 overflow-y-auto border-r border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Available Travels
          </h2>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab("online")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "online"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              Online Travels
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeTab === "all"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              All Travels
            </button>
          </div>

          <div className="space-y-4">
            {travels?.map((travel) => (
              <div
                key={travel.id}
                className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={travel.kyc?.[0]?.path || "/default-avatar.png"}
                    alt={`${travel.firstName} ${travel.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {travel.firstName} {travel.middleName} {travel.lastName}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                    vehicle: {travel.vehicleType} • {travel.gender}
                  </p>

                  <div className="flex gap-3">
                    <Button
                      buttonText={authLabel.booknow[lang]}
                      className="bg-blue-600 text-white px-4 py-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      type="button"
                      onClick={() => setTravelId(travel.id)}
                    />
                    <Button
                      buttonText={authLabel.viewProfile[lang]}
                      className="border bg-gray-900 border-gray-300 px-4 py-4 rounded-lg text-sm font-medium hover:bg-gray-700"
                      type="button"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-2/3 relative">
          {!travels || !userLocation ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <TravelMap
              props={travels.map((travel) => ({
                id: travel.id,
                firstName: travel.firstName,
                middleName: travel.middleName || "",
                lastName: travel.lastName,
                rating: 4.8,
                image: travel.kyc?.[0]?.path || "",
                location: {
                  latitude: Number(travel.location?.latitude) || 0,
                  longitude: Number(travel.location?.longitude) || 0,
                },
                gender: travel.gender,
              }))}
              zoom={12}
            />
          )}
        </div>
      </div>

      <div className="md:hidden h-full">
        <div className="h-full">
          {!travels || !userLocation ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <TravelMap
              props={travels.map((travel) => ({
                id: travel.id,
                firstName: travel.firstName,
                middleName: travel.middleName || "",
                lastName: travel.lastName,
                rating: 4.8,
                image: travel.kyc?.[0]?.path || "",
                location: {
                  latitude: Number(travel.location?.latitude) || 0,
                  longitude: Number(travel.location?.longitude) || 0,
                },
                gender: travel.gender,
              }))}
              zoom={12}
            />
          )}
        </div>

        <button
          onClick={() => setShowMobileList(!showMobileList)}
          className="fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6"
          >
            {showMobileList ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5"
              />
            )}
          </svg>
        </button>

        <div
          className={`fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-2xl shadow-xl transform transition-transform duration-300 ease-in-out ${
            showMobileList ? "translate-y-0" : "translate-y-full"
          }`}
          style={{ maxHeight: "75vh" }}
        >
          <div className="p-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Available Travels
            </h2>

            <div className="flex gap-2 mb-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab("online")}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === "online"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                Online Travels
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Travels
              </button>
            </div>

            <div
              className="space-y-3 overflow-y-auto"
              style={{ maxHeight: "60vh" }}
            >
              {travels?.map((travel) => (
                <div
                  key={travel.id}
                  className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3 border border-gray-100"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={travel.kyc?.[0]?.path || "/default-avatar.png"}
                      alt={`${travel.firstName} ${travel.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-800 truncate">
                        {travel.firstName} {travel.middleName} {travel.lastName}
                      </h3>
                      <div className="flex items-center flex-shrink-0">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 ml-1">4.8</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-2 truncate">
                      vehicle: {travel.vehicleType} • {travel.gender}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        buttonText={authLabel.booknow[lang]}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        type="button"
                        onClick={() => setTravelId(travel.id)}
                      />
                      <Button
                        buttonText={authLabel.viewProfile[lang]}
                        className="border bg-gray-900 border-gray-300 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-700"
                        type="button"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {travelId && (
        <RequestTravelBooking id={travelId} onClose={() => setTravelId("")} />
      )}
    </div>
  );
};

export default Travels;
