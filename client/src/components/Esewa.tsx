import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

interface PaymentProps {
  id: string;
  amount: number;
  type: "travel" | "guide";
}

const Esewa: React.FC<PaymentProps> = ({ id, amount, type }) => {
  const hashedId = `${uuidv4()}_${id}`;
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setformData] = useState({
    amount: amount.toString(),
    tax_amount: "0",
    total_amount: amount.toString(),
    transaction_uuid: uuidv4(),
    product_service_charge: "0",
    product_delivery_charge: "0",
    product_code: "EPAYTEST",
    success_url: `http://localhost:3001/paymentsuccess/${type}/${hashedId}`,
    failure_url: "http://localhost:3001/paymentfailure",
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: "",
    secret: "8gBm/:&EnhH.1/q",
  });

  const generateSignature = (
    total_amount: string,
    transaction_uuid: string,
    product_code: string,
    secret: string
  ) => {
    const hashString = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
    const hash = CryptoJS.HmacSHA256(hashString, secret);
    return CryptoJS.enc.Base64.stringify(hash);
  };
  useEffect(() => {
    const {
      total_amount,
      transaction_uuid,
      product_code,
      secret,
    } = formData;

    const signature = generateSignature(
      total_amount,
      transaction_uuid,
      product_code,
      secret
    );

    setformData((prev) => ({ ...prev, signature }));
  }, []);

  useEffect(() => {
    if (formData.signature && formRef.current) {
      formRef.current.submit();
    }
  }, [formData.signature]);

  return (
    <form
      ref={formRef}
      action="https://rc-epay.esewa.com.np/api/epay/main/v2/form"
      method="POST"
      style={{ display: "none" }}
    >
      <input type="hidden" name="amount" value={formData.amount} />
      <input type="hidden" name="tax_amount" value={formData.tax_amount} />
      <input type="hidden" name="total_amount" value={formData.total_amount} />
      <input type="hidden" name="transaction_uuid" value={formData.transaction_uuid} />
      <input type="hidden" name="product_code" value={formData.product_code} />
      <input type="hidden" name="product_service_charge" value={formData.product_service_charge} />
      <input type="hidden" name="product_delivery_charge" value={formData.product_delivery_charge} />
      <input type="hidden" name="success_url" value={formData.success_url} />
      <input type="hidden" name="failure_url" value={formData.failure_url} />
      <input type="hidden" name="signed_field_names" value={formData.signed_field_names} />
      <input type="hidden" name="signature" value={formData.signature} />
    </form>
  );
};

export default Esewa;
