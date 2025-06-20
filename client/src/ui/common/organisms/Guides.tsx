import { gql, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useLang } from "@/hooks/useLang";
import GuideMap from "@/components/ui/GuideMap";
import { authLabel } from "@/localization/auth";
import Button from "@/ui/common/atoms/Button";
import RequestGuideBooking from "@/components/RequestGuideBooking";
import GuideProfileUserView from "@/components/GuideProfile";
import { useSocket } from "@/contexts/SocketContext";

const GET_GUIDE_QUERY = gql`
  query FindGuide {
    findGuide {
      id
      firstName
      middleName
      lastName
      gender
      guiding_location
      location {
        latitude
        longitude
      }
      kyc {
        id
        path
      }
         ratings{
        id
        rating
        message
       
        }
    }
  }
`;

interface FormData {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  guiding_location: string;
  gender: string;
  location: Location;
  nationality: string;
  kyc: Kyc[];
}

interface Kyc {
  id: string;
  path: string;
}

interface Location {
  latitude: string;
  longitude: string;
}

const Guides = () => {
  const [activeTab, setActiveTab] = useState<"online" | "all">("online");
  const [allGuides, setAllGuides] = useState<FormData[] | null>(null);
  const [onlineGuides, setOnlineGuides] = useState<FormData[] | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [guideId, setGuideId] = useState<string>("");
  const { socket } = useSocket();
  const [showMobileList, setShowMobileList] = useState(true);
  const [guide, setGuide] = useState<string>("");
  const { lang } = useLang();
  const { data, loading } = useQuery(GET_GUIDE_QUERY);
  console.log("🚀 ~ Guides ~ data:", data)

  const guides = activeTab === "online" ? onlineGuides : allGuides;
  console.log("🚀 ~ Guides ~ guides:", guides)

  useEffect(() => {
    if (data) {
      setAllGuides(data.findGuide);
    }
    socket.emit("get-active-guides");
  }, [data]);

  useEffect(() => {
    socket.on("active-guide", (activeGuides: FormData[]) => {
      setOnlineGuides(activeGuides);
    });

    socket.on(
      "guides",
      (updatedGuide: {
        id: string;
        location: { latitude: string; longitude: string };
      }) => {
        setOnlineGuides((prevGuides) =>
          prevGuides?.map((guide) =>
            guide.id === updatedGuide.id
              ? {
                ...guide,
                location: {
                  latitude: updatedGuide.location.latitude,
                  longitude: updatedGuide.location.longitude,
                },
              }
              : guide
          ) || null
        );

        setOnlineGuides((prevGuides) =>
          prevGuides?.map((guide) =>
            guide.id === updatedGuide.id
              ? {
                ...guide,
                location: {
                  latitude: updatedGuide.location.latitude,
                  longitude: updatedGuide.location.longitude,
                },
              }
              : guide
          ) || null
        );
      }
    );

    socket.on(
      "active-guide",
      (updatedGuide: {
        id: string;
        location: { latitude: string; longitude: string };
      }) => {
        setOnlineGuides((prevGuides) =>
          prevGuides?.map((guide) =>
            guide.id === updatedGuide.id
              ? {
                ...guide,
                location: {
                  latitude: updatedGuide.location.latitude,
                  longitude: updatedGuide.location.longitude,
                },
              }
              : guide
          ) || null
        );
      }
    );

    return () => {
      socket.off("guides");
      socket.off("active-guides");
      socket.off("active-guide");
    };
  }, [socket]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
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
            {authLabel.availableGuides[lang]}
          </h2>

          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setActiveTab("online")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "online"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {authLabel.onlineGuides[lang]}
            </button>
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "all"
                ? "bg-purple-100 text-purple-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {authLabel.allGuides[lang]}</button>
          </div>

          <div className="space-y-4">
            {guides?.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={guide.kyc?.[0]?.path || "/default-avatar.png"}
                    alt={`${guide.firstName} ${guide.lastName}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {guide.firstName} {guide.middleName} {guide.lastName}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-yellow-400">★</span>
                      <span className="text-sm text-gray-600 ml-1">4.8</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-3">
                  {authLabel.location[lang]}: {guide.guiding_location} •  {authLabel.gender[lang]}: {guide.gender === "MALE" ? ` ${authLabel.male[lang]}` : `${authLabel.female[lang]}`}
                  </p>

                  <div className="flex gap-3">
                    <Button
                      buttonText={authLabel.book[lang]}
                      onClick={() => setGuideId(guide.id)}
                      className="bg-blue-600 text-white px-4 py-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      type="button"
                    />
                    <Button
                      onClick={() => setGuide(guide.id)}
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
          {!guides || !userLocation ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <GuideMap
              key={JSON.stringify(guides)}
              props={guides.map((guide) => ({
                id: guide.id,
                firstName: guide.firstName,
                middleName: guide.middleName || "",
                lastName: guide.lastName,
                rating: 4.8,
                image: guide.kyc?.[0]?.path || "",
                location: {
                  latitude: Number(guide.location?.latitude) || 0,
                  longitude: Number(guide.location?.longitude) || 0,
                },
                gender: guide.gender,
              }))}
              center={userLocation}
              zoom={12}
            />
          )}
        </div>
      </div>

      <div className="md:hidden h-full">
        <div className="h-full">
          {!guides || !userLocation ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : (
            <GuideMap
              props={guides.map((guide) => ({
                id: guide.id,
                firstName: guide.firstName,
                middleName: guide.middleName || "",
                lastName: guide.lastName,
                rating: 4.8,
                image: guide.kyc?.[0]?.path || "",
                location: {
                  latitude: Number(guide.location?.latitude) || 0,
                  longitude: Number(guide.location?.longitude) || 0,
                },
                gender: guide.gender,
              }))}
              center={userLocation}
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
          className={`fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-2xl shadow-xl transform transition-transform duration-300 ease-in-out ${showMobileList ? "translate-y-0" : "translate-y-full"
            }`}
          style={{ maxHeight: "75vh" }}
        >
          <div className="p-4">
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {authLabel.availableGuides[lang]}
            </h2>

            <div className="flex gap-2 mb-4 overflow-x-auto">
              <button
                onClick={() => setActiveTab("online")}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "online"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {authLabel.onlineGuides[lang]}
              </button>
              <button
                onClick={() => setActiveTab("all")}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${activeTab === "all"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {authLabel.allGuides[lang]}              </button>
            </div>

            <div
              className="space-y-3 overflow-y-auto"
              style={{ maxHeight: "60vh" }}
            >
              {guides?.map((guide) => (
                <div
                  key={guide.id}
                  className="bg-white rounded-lg p-3 shadow-sm flex items-center gap-3 border border-gray-100"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={guide.kyc?.[0]?.path || "/default-avatar.png"}
                      alt={`${guide.firstName} ${guide.lastName}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-grow min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-gray-800 truncate">
                        {guide.firstName} {guide.middleName} {guide.lastName}
                      </h3>
                      <div className="flex items-center flex-shrink-0">
                        <span className="text-yellow-400">★</span>
                        <span className="text-sm text-gray-600 ml-1">4.8</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-2 truncate">
                      Location: {guide.guiding_location} • {guide.gender}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        buttonText={authLabel.book[lang]}
                        onClick={() => setGuideId(guide.id)}
                        className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        type="button"
                      />
                      <Button
                        onClick={() => setGuide(guide.id)}
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
      {guideId && (
        <RequestGuideBooking id={guideId} onClose={() => setGuideId("")} />
      )}
      {guide && (
        <GuideProfileUserView
          guideId={guide}
          isOpen={true}
          onClose={() => setGuide("")}
        />
      )}
    </div>
  );
};

export default Guides;