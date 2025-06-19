import { useState, useEffect } from "react";

import TravelBookingHistory from "@/components/TravelBookingHistory";
import GuideBookingHistory from "@/components/GuideBookingHistory";

const BookingHistory = () => {
  const [activeTab, setActiveTab] = useState<"travel" | "guide">(() => {
    return (
      (localStorage.getItem("activeTab") as "travel" | "guide") || "travel"
    );
  });

  useEffect(() => {
    localStorage.setItem("activeTab", activeTab);
  }, [activeTab]);

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
        {activeTab === "travel" ? <TravelBookingHistory /> : <GuideBookingHistory />}
      </div>
    </div>
  );
};

export default BookingHistory;
