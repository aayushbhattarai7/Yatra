// import { authLabel } from "@/localization/auth";
// import { gql, useQuery } from "@apollo/client";
// import Button from "../ui/common/atoms/Button";
// import { useEffect, useState } from "react";
// import { useLang } from "@/hooks/useLang";
// import RequestTravelBooking from "./RequestTravelBooking";

// const GET_TRAVEL_QUERY = gql`
//   query FindTravel {
//     findTravel {
//       id
//       firstName
//       middleName
//       lastName
//       gender
//       available
//       vehicleType
//       kyc {
//         id
//         path
//       }
//     }
//   }
// `;

// interface FormData {
//   id: string;
//   firstName: string;
//   middleName: string;
//   lastName: string;
//   vehicleType: string;
//   gender: string;
//   kyc: KYC[];
// }
// interface KYC {
//   id: string;
//   path: string;
// }

// const Travels = () => {
//   const [travels, setTravels] = useState<FormData[] | null>(null);
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const { lang } = useLang();

//   const { data, loading, error } = useQuery(GET_TRAVEL_QUERY);
//   console.log("🚀 ~ Travels ~ data:", data);

//   useEffect(() => {
//     if (data) {
//       setTravels(data.findTravel);
//     }
//   }, [data]);

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>Error: {error.message}</div>;

//   return (
//     <>
      
//       {selectedId && (
//         <RequestTravelBooking
//           id={selectedId}
//           onClose={() => setSelectedId(null)}
//         />
//       )}
//       <div>
//         {travels?.map((travel) => (
//           <div key={travel.id}>
//             <img src={travel.kyc[0]?.path} alt="jhjh" />
//             <p>ID: {travel.id}</p>
//             <p>First Name: {travel.firstName}</p>
//             <p>Middle Name: {travel.middleName}</p>
//             <p>Last Name: {travel.lastName}</p>
//             <p>Vehicle: {travel.vehicleType}</p>
//             <p>Gender: {travel.gender}</p>
//             <Button
//               type="button"
//               buttonText={authLabel.book[lang]}
//               onClick={() => setSelectedId(travel.id)}
//             />
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// export default Travels;
import React, { useEffect } from "react";
import { useMapContext, MarkerData } from "../contexts/MapContext";
import MapView from "./MapView";

const Travels: React.FC = () => {
  const { setMarkers } = useMapContext();

  useEffect(() => {
    const travelData: MarkerData[] = [
      {
        firstName: "John",
        middleName: "K.",
        lastName: "Doe",
        latitude: 34.0522,
        longitude: -118.2437,
        photo: "https://via.placeholder.com/40?text=JD",
      },
      {
        firstName: "Jane",
        middleName: "A.",
        lastName: "Smith",
        latitude: 34.0622,
        longitude: -118.2537,
        photo: "https://via.placeholder.com/40?text=JS",
      },
    ];

    setMarkers(travelData);
  }, [setMarkers]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Travels</h2>
      <MapView />
      <p className="text-sm mt-2">
        Travel details have been loaded into the map.
      </p>
    </div>
  );
};

export default Travels;
