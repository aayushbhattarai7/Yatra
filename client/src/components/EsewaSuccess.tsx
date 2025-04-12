import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "@/service/axiosInstance";
import { showToast } from "./ToastNotification";

const Success: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const { id } = useParams();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const [hash, requestId] = id?.split("_") || [];
    console.log(requestId, "hahah");
    const token = searchParams.get("data");

    if (token && requestId) {
      sendPaymentDataToBackend(token, requestId);
    }
  }, []);

  const sendPaymentDataToBackend = async (token: string, requestId: string) => {
    try {
      const endpoint =
        type === "guide"  ? "/user/guide-esewa" : "/user/travel-esewa";
      console.log(`Sending data to ${endpoint}`);
      console.log(requestId, "oknice");
      const response = await axiosInstance.post(endpoint, { token, requestId });
      console.log("Backend Response:", response.data.data);
      showToast(response.data.data, "success");

      setTimeout(() => {
        navigate("/booking");
      }, 2000);
    } catch (error) {
      if (error instanceof Error) {
        showToast(error.message, "error");
      }
      console.error("Error sending payment data to backend:", error);
    }
  };

  return <div></div>;
};

export default Success;
