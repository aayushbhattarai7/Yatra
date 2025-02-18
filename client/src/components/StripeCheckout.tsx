import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useMutation } from "@apollo/client";
import { ADVANCE_PAYMENT_FOR_TRAVEL } from "@/mutation/queries";

interface CheckoutProps {
  amount: number;
  travelId: string;
  refresh: (travelId: string) => void;
}

const Checkout: React.FC<CheckoutProps> = ({ amount, travelId, refresh }) => {
  const stripe = useStripe();
  const elements = useElements();
const [AdvancePaymentForTravel] = useMutation(ADVANCE_PAYMENT_FOR_TRAVEL);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    try {
        const response = await AdvancePaymentForTravel({
          variables:{travelId,price:amount}
        })
      const { clientSecret } = response.data;

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement!,
          },
        }
      );

      if (error) {
        console.error("Payment failed:", error.message);
      } else if (paymentIntent?.status === "succeeded") {
        alert("Payment successful!");
        refresh(travelId);
      }
    } catch (error) {
      console.error("Error during payment process:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit">
        Pay ${amount / 100}
      </button>
    </form>
  );
};

export default Checkout;
