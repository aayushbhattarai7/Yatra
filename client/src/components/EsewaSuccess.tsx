import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import axiosInstance from "@/service/axiosInstance";
import { showToast } from "./ToastNotification";

const Success: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
const [id, setId] = useState<string>("")
    useEffect(() => {

        const id = localStorage.getItem("id")!;
        setId(id)
    },[])
  useEffect(() => {
    console.log("🚀 ~ useEffect ~ id:", id);
    console.log(id, "ha");
    const [hash, requestId] = id!.split("_");
    const token = searchParams.get("data");
    if (token) {
      sendPaymentDataToBackend(token, requestId);
    }
  }, [id]);

  const sendPaymentDataToBackend = async (token: string, requestId: string) => {
      try {
        console.log( requestId,"akjdjajdjahdjhadajdhjadh")
      const response = await axiosInstance.post("/user/travel-esewa", {
        token,
        requestId,
      });
          console.log("Backend Response:", response.data.data);
          showToast(response.data.data, "success")
          setInterval(() => {
              navigate("/booking")
          }, 2000)
      } catch (error) {
          if (error instanceof Error) {
              
              showToast(error.message,"success")
          }
      console.error("Error sending payment data to backend:", error);
    }
  };
  

  return (
    <div>
    
    </div>
  );
};

export default Success;
