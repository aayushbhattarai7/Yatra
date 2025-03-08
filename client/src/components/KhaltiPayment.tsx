import React, { useState } from "react";
import axiosInstance from "../service/axiosInstance";

interface KhaltiProps {
  id: string;
  amount: number;
  type: "guide" | "travel";
}

const Khalti: React.FC<KhaltiProps> = ({ id, amount, type }) => {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePaymentInitiation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const payload = {
        purchase_order_id: id,
        amount,
        website_url: "http://localhost:3001",
        return_url: `http://localhost:3001/khaltiSuccess/${type}/${id}`,
        purchase_order_name: "Travel",
        error_key: "http://localhost:3001/paymentfailure",
      };

      const response = await axiosInstance.post(
        "/khalti/initialize-esewa",
        payload
      );
      const paymentUrl = response.data.paymentDetails.payment_url;
      console.log("🚀 ~ handlePaymentInitiation ~ paymentUrl:", paymentUrl)

      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Payment initiation error:", error);
      setErrorMessage("Failed to initialize payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="khalti-payment-container">
      <form onSubmit={handlePaymentInitiation}>
        <div className="payment-details">
          <p>Amount: NPR {amount}</p>
        </div>

        <div className="form-group">
          <input
            type="hidden"
            id="callbackUrl"
            name="website_url"
            value={"https://test-pay.khalti.com"}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            pattern="https?://.*"
            required
            placeholder="https://test-pay.khalti.com"
          />
        </div>

        {errorMessage && <div className="error-message">{errorMessage}</div>}

        <button type="submit" disabled={isLoading} className="khalti-button">
          {isLoading ? "Processing..." : "Pay with Khalti"}
        </button>
      </form>
    </div>
  );
};

export default Khalti;
