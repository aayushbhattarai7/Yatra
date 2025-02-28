import React, { useState, FormEvent } from "react";
import { generateUniqueId } from "../function/generateUuid";
import axiosInstance from "@/service/axiosInstance";
interface PaymentProps {
  id: string;
  amounts: number;
}
const PaymentForm: React.FC<PaymentProps> = ({ id, amounts }) => {
  const [amount, setAmount] = useState<number>(0);
  const [signature, setSignature] = useState<string>("");

  const handlePayment = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const formData = { amount, productId: id };
      const response = await axiosInstance.post(
        "/esewa/initialize-esewa",
        formData
      );

      setSignature(response.data.paymentDetails.signature);
    } catch (error) {
      console.error("Error initiating payment:", error);
    }
  };

  // eSewa form details
  const productCode = "EPAYTEST";
//   const successUrl = "http://localhost:3000/api/esewa/complete-payment";
  const failureUrl = "http://localhost:3001/failure";
  const successUrl = "http://localhost:3001/success";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h1 className="text-2xl font-semibold text-center mb-4">
          eSewa Payment Integration
        </h1>

        <form onSubmit={handlePayment} className="space-y-4">
          <div className="form-group">
            <label htmlFor="amount" className="block font-medium">
              Amount:
            </label>
            <input
              id="amount"
              type="number"
              value={amounts}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              required
              placeholder="Enter amount"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
          >
            Initialize Payment
          </button>
        </form>

        {/* Show eSewa form only after signature is received */}
        {signature && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-green-600 text-center mb-4">
              Proceed to eSewa
            </h2>
            <form
              action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
              method="POST"
            >
              <input type="" name="amount" value={amounts} />
              <input type="" name="tax_amount" value="0" />
              <input type="" name="total_amount" value={amounts} />
              <input type="" name="transaction_uuid" value={id} />
              <input type="" name="product_code" value={productCode} />
              <input type="" name="success_url" value={successUrl} />
              <input type="" name="failure_url" value={failureUrl} />
              <input type="" name="signature" value={signature} />

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
              >
                Pay with eSewa
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;
