import React from "react";
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";

interface StatusCardProps {
  type: "success" | "error";
  title: string;
  description: string;
  onClick: () => void;
}

const StatusCard: React.FC<StatusCardProps> = ({
  type,
  title,
  description,
  onClick,
}) => {
  const isSuccess = type === "success";

  return (
    <div
      className="flex flex-col items-center w-96 h-[30rem] rounded-xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform"
      style={{
        backgroundColor: "#ffffff",
      }}
    >
      <div
        className="w-full h-48 flex items-center justify-center"
        style={{
          backgroundColor: isSuccess ? "#4CAF50" : "#F44336",
        }}
      >
        <div className="flex items-center justify-center w-28 h-28 rounded-full border-4 border-white ">
          {isSuccess ? (
            <AiOutlineCheck className="text-white text-8xl" />
          ) : (
            <AiOutlineClose className="text-white text-6xl" />
          )}
        </div>
      </div>

      <div className="w-full p-6 flex flex-col items-center text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 text-xl font-poppins mb-6">{description}</p>
        <button
          onClick={onClick}
          className={`px-6 py-2 rounded-full text-white font-semibold transition-colors duration-300 
            ${
              isSuccess
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
        >
          {isSuccess ? "Continue" : "Try Again"}
        </button>
      </div>
    </div>
  );
};

export default StatusCard;
