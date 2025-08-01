import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useMutation } from "@apollo/client";
import { ADVANCE_PAYMENT_FOR_GUIDE, ADVANCE_PAYMENT_FOR_TRAVEL } from "@/mutation/queries";
import { showToast } from "./ToastNotification";

interface CheckoutProps {
  amount: number;
  travelId: string;
  refresh: (travelId: string) => void;
  onClose: () => void;
  type: "travel" | "guide"
}

const Checkout: React.FC<CheckoutProps> = ({
  amount,
  travelId,
  refresh,
  onClose,
  type,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [AdvancePaymentForTravel] = useMutation(ADVANCE_PAYMENT_FOR_TRAVEL);
  const [AdvancePaymentForGuide] = useMutation(ADVANCE_PAYMENT_FOR_GUIDE)
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    try {
      const query = type==="travel"? AdvancePaymentForTravel:AdvancePaymentForGuide
      const response = await query({
        variables: { travelId, amount: amount },
      });
      const client_secret = type==="travel"? response.data.AdvancePaymentForTravel:response.data.AdvancePaymentForGuide 
      console.log("🚀 ~ handleSubmit ~ client_secret:", client_secret);

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        client_secret,
        {
          payment_method: {
            card: cardElement!,
          },
        },
      );

      if (error) {
        console.error("Payment failed:", error.message);
      } else if (paymentIntent?.status === "succeeded") {
        showToast("Payment successful!","success");

        refresh(travelId);
        onClose();
      }
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-semibold mb-4">Payment</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 border p-3 rounded">
            <CardElement />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Pay Rs.{amount}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
