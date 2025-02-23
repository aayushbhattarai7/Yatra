import React from "react";
import { useQuery } from "@apollo/client";
import { GET_PAYMENT_DETAILS } from "../mutation/queries";

interface EsewaProps {
  amount: number;
}

const EsewaPayment: React.FC<EsewaProps> = ({ amount }) => {
  const productCode = "EPAYTEST";

  const { data, loading, error } = useQuery(GET_PAYMENT_DETAILS, {
    variables: { total_amount: amount, product_code: productCode },
    skip: amount <= 0,
  });

  if (loading) return <p>Loading...</p>;

  if (error) {
    console.error("Error fetching payment details:", error.message);
    return <p className="text-red-500">Error: {error.message}</p>;
  }

  const payment = data?.generatePaymentDetails;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <h2 className="text-2xl font-semibold text-green-600 text-center mb-4">
          eSewa Payment
        </h2>
        <form
          action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
          method="POST"
          className="space-y-4"
        >
          <input type="hidden" name="amount" value={payment?.amount || ""} />
          <input
            type="hidden"
            name="tax_amount"
            value={payment?.tax_amount || ""}
          />
          <input
            type="hidden"
            name="total_amount"
            value={payment?.total_amount || ""}
          />
          <input
            type="hidden"
            name="transaction_uuid"
            value={payment?.transaction_uuid || ""}
          />
          <input
            type="hidden"
            name="product_code"
            value={payment?.product_code || ""}
          />
          <input
            type="hidden"
            name="success_url"
            value={payment?.success_url || ""}
          />
          <input
            type="hidden"
            name="failure_url"
            value={payment?.failure_url || ""}
          />
          <input
            type="hidden"
            name="signature"
            value={payment?.signature || ""}
          />

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
            disabled={!payment}
          >
            Pay with eSewa
          </button>
        </form>
      </div>
    </div>
  );
};

export default EsewaPayment;
