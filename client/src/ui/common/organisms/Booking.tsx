import { useState, useEffect } from "react";
import GuideBooking from "@/components/GuideBooking";
import TravelBooking from "@/components/TravelBooking";

const Booking = () => {
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
      <div className="flex justify-around items-center border-b">
        <button
          onClick={() => setActiveTab("travel")}
          className={`px-4 py-4 ${activeTab === "travel" ? "font-bold" : ""}`}
        >
          Travel
        </button>
        <button
          onClick={() => setActiveTab("guide")}
          className={`px-4 py-4 ${activeTab === "guide" ? "font-bold" : ""}`}
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
