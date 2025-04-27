import React, { useEffect } from "react";
import axiosInstance from "../service/axiosInstance";

interface KhaltiProps {
  id: string;
  amount: number;
  type: "guide" | "travel";
}

const Khalti: React.FC<KhaltiProps> = ({ id, amount, type }) => {
  console.log("🚀 ~ amount:", amount)
  const handlePaymentInitiation = async () => {
    try {
      const payload = {
        purchase_order_id: id,
        amount:amount*100,
        website_url: "http://localhost:3001",
        return_url: `http://localhost:3001/khaltiSuccess/${type}/${id}`,
        purchase_order_name: type,
        error_key: "http://localhost:3001/paymentfailure",
      };

      const response = await axiosInstance.post(
        "/khalti/initialize-esewa",
        payload,
      );
      console.log("🚀 ~ handlePaymentInitiation ~ response:", response)
      const paymentUrl = response.data.paymentDetails.payment_url;
      console.log("🚀 ~ handlePaymentInitiation ~ paymentUrl:", paymentUrl);

      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Payment initiation error:", error);
    }
  };
  useEffect(() => {
    handlePaymentInitiation();
  }, []);

  return <div className="khalti-payment-container"></div>;
};

export default Khalti;
