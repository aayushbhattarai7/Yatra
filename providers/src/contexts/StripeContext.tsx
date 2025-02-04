import React, { createContext, useContext, ReactNode } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

const publishKey = import.meta.env.VITE_STRIPE_PUBLISH_KEY!;
const stripePromise = loadStripe(publishKey);

interface StripeContextProps {
  stripePromise: Promise<any>;
}

const StripeContext = createContext<StripeContextProps | undefined>(undefined);

export const StripeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <StripeContext.Provider value={{ stripePromise }}>
      <Elements stripe={stripePromise}>{children}</Elements>
    </StripeContext.Provider>
  );
};

export const useStripeContext = (): StripeContextProps => {
  const context = useContext(StripeContext);
  if (!context) {
    throw new Error("useStripeContext must be used within a StripeProvider");
  }
  return context;
};
