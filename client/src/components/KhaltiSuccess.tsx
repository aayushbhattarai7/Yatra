import React, { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "@/service/axiosInstance";
import { showToast } from "./ToastNotification";

const KhaltiSuccess: React.FC = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const { id } = useParams();

  const [searchParams] = useSearchParams();
  const pidx = searchParams.get("pidx");

  useEffect(() => {
    if (pidx && id) {
      sendPaymentDataToBackend(pidx, id);
    }
  }, []);

  const sendPaymentDataToBackend = async (pidx: string, requestId: string) => {
    try {
      console.log("yes");
      const endpoint =
        type === "guide" ? "/user/guide-khalti" : "/user/travel-khalti";
      console.log("🚀 ~ sendPaymentDataToBackend ~ endpoint:", endpoint);
      const response = await axiosInstance.post(endpoint, { pidx, requestId });
      console.log("Backend Response:", response.data);
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

export default KhaltiSuccess;
