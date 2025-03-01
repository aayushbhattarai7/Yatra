import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axiosInstance from "@/service/axiosInstance";

const Success: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("data"); // Get the data token from URL
    console.log("🚀 ~ useEffect ~ token:", token)

    if (token) {
      sendPaymentDataToBackend(token);
    }
  }, []);

  const sendPaymentDataToBackend = async (token: string) => {
      try {
        console.log(token,"hahahrokk")
      const response = await axiosInstance.post("/esewa/complete-payment", {
        token,
      });
      console.log("Backend Response:", response.data); // Log response from backend
    } catch (error) {
      console.error("Error sending payment data to backend:", error);
    }
  };

  return (
    <div>
      <h1>Payment Successful!</h1>
      <p>Thank you for your payment. Your transaction was successful.</p>
      <button onClick={() => navigate("/")} className="go-home-button">
        Go to Homepage
      </button>
    </div>
  );
};

export default Success;
