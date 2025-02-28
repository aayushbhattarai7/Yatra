// import React from "react";
// import { useQuery } from "@apollo/client";
// import { GET_PAYMENT_DETAILS } from "../mutation/queries";

// interface EsewaProps {
//   amount: number;
//   signature:string
// }

// const EsewaPayment: React.FC<EsewaProps> = ({ amount=100, signature }) => {
//   const productCode = "EPAYTEST";
// const success_url = "http://localhost:3000/api/esewa/complete-payment";
// const failure_url = "http://localhost:3001/failure";
//   return (
//     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
//       <div className="bg-white shadow-lg rounded-lg p-6 w-96">
//         <h2 className="text-2xl font-semibold text-green-600 text-center mb-4">
//           eSewa Payment
//         </h2>
//         <form
//           action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
//           method="POST"
//           className="space-y-4"
//         >
//           <input type="hidden" name="amount" value={amount || ""} />
//           <input type="hidden" name="tax_amount" value={0 || ""} />
//           <input type="hidden" name="total_amount" value={0 || ""} />
//           <input type="hidden" name="transaction_uuid" value={0 || ""} />
//           <input type="hidden" name="product_code" value={productCode || ""} />
//           <input type="hidden" name="success_url" value={success_url || ""} />
//           <input type="hidden" name="failure_url" value={failure_url || ""} />
//           <input type="hidden" name="signature" value={signature || ""} />

//           <button
//             type="submit"
//             className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
//           >
//             Pay with eSewa
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default EsewaPayment;
import React from "react";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
interface PaymentProps {
  id: string;
  amounts: number;
}
const Esewa:React.FC<PaymentProps> = ({ id, amounts }) => {
  const [formData, setformData] = useState({
    amount: amounts.toString(),
    tax_amount: "0",
    total_amount: amounts.toString(),
    transaction_uuid: id,
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: "http://localhost:5173/paymentsuccess",
    failure_url: "http://localhost:5173/paymentfailure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });

  // generate signature function
  const generateSignature = (
    total_amount: string,
    transaction_uuid: string,
    product_code: string,
    secret: string
  ) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    const hashedSignature = CryptoJS.enc.Base64.stringify(hash);
    return hashedSignature;
  };

  // useeffect
  useEffect(() => {
    const { total_amount, transaction_uuid, product_code, secret } = formData;
    const hashedSignature = generateSignature(
      total_amount,
      transaction_uuid,
      product_code,
      secret
    );

    setformData({ ...formData, signature: hashedSignature });
  }, [formData.amount]);

  return (
    <form
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
    >
      <h1>Checkout</h1>
      <div className="field">
        <label htmlFor="">Amount</label>
        <input
          type="text"
          id="amount"
          name="amount"
          autoComplete="off"
          value={formData.amount}
          onChange={({ target }) =>
            setformData({
              ...formData,
              amount: target.value,
              total_amount: target.value,
            })
          }
          required
        />
      </div>
      <input
        type="hidden"
        id="tax_amount"
        name="tax_amount"
        value={formData.tax_amount}
        required
      />
      <input
        type="hidden"
        id="total_amount"
        name="total_amount"
        value={formData.total_amount}
        required
      />
      <input
        type="hidden"
        id="transaction_uuid"
        name="transaction_uuid"
        value={formData.transaction_uuid}
        required
      />
      <input
        type="hidden"
        id="product_code"
        name="product_code"
        value={formData.product_code}
        required
      />
      <input
        type="hidden"
        id="product_service_charge"
        name="product_service_charge"
        value={formData.product_service_charge}
        required
      />
      <input
        type="hidden"
        id="product_delivery_charge"
        name="product_delivery_charge"
        value={formData.product_delivery_charge}
        required
      />
      <input
        type="hidden"
        id="success_url"
        name="success_url"
        value={formData.success_url}
        required
      />
      <input
        type="hidden"
        id="failure_url"
        name="failure_url"
        value={formData.failure_url}
        required
      />
      <input
        type="hidden"
        id="signed_field_names"
        name="signed_field_names"
        value={formData.signed_field_names}
        required
      />
      <input
        type="hidden"
        id="signature"
        name="signature"
        value={formData.signature}
        required
      />
      <input className="btn" value="Pay via E-Sewa" type="submit" />
    </form>
  );
};

export default Esewa;