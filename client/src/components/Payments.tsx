import React, { useState, useEffect } from "react";
import { FaTimes, FaCreditCard } from "react-icons/fa";
import { SiKashflow } from "react-icons/si";
import { SiEsea } from "react-icons/si";
import EsewaPayment from "./Esewa";
import Khalti from "./KhaltiPayment";
import Checkout from "./StripeCheckout";

interface payProps {
  id: string;
  refresh: () => void;
  onClose: () => void;
  amount: number;
  type: "travel" | "guide";
}

const Payments: React.FC<payProps> = ({
  id,
  refresh,
  onClose,
  type,
  amount,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [esewa, setEsewa] = useState(false);
  const [khalti, setKhalti] = useState(false);
  const [stripe, setStripe] = useState(false);

  useEffect(() => {
    setShowModal(true);
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">
                Select Payment Method
              </h2>
              <button onClick={() => setShowModal(false)}>
                <FaTimes
                  className="text-gray-500 hover:text-red-500"
                  size={20}
                />
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <button
                className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-gray-100"
                onClick={() => setEsewa(true)}
              >
                <span className="flex items-center gap-2">
                  <span className="font-medium">eSewa Rs.{amount}</span>
                </span>
              </button>

              <button
                className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-gray-100"
                onClick={() => setKhalti(true)}
              >
                <span className="flex items-center gap-2">
                  <span className="font-medium">Khalti Rs.{amount}</span>
                </span>
              </button>

              <button
                className="flex items-center justify-between w-full p-3 border rounded-lg hover:bg-gray-100"
                onClick={() => setStripe(true)}
              >
                <span className="flex items-center gap-2">
                  <span className="font-medium">Credit Card Rs.{amount}</span>
                </span>
              </button>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>

          {esewa && <EsewaPayment amount={amount} type={type} id={id} />}
          {khalti && <Khalti amount={amount} type={type} id={id} />}
          {stripe && (
            <Checkout
              amount={amount}
              type={type}
              travelId={id}
              refresh={refresh}
              onClose={onClose}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Payments;
