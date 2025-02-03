import { useState } from "react";
import GuideBooking from "@/components/GuideBooking";
import TravelBooking from "@/components/TravelBooking";

const Booking = () => {
  const [activeTab, setActiveTab] = useState<"travel" | "guide">("travel");

  return (
    <div>
      <div className="flex justify-around items-center border-b pb-2">
        <button
          onClick={() => setActiveTab("travel")}
          className={`px-4 py-2 ${activeTab === "travel" ? "font-bold" : ""}`}
        >
          Travel
        </button>
        <button
          onClick={() => setActiveTab("guide")}
          className={`px-4 py-2 ${activeTab === "guide" ? "font-bold" : ""}`}
        >
          Guide
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "travel" ? <TravelBooking /> : <GuideBooking />}
      </div>
    </div>
  );
};

export default Booking;
