import axios from "axios";
import { EsewaUtil } from "../utils/generateHash";
import { DotenvConfig } from "../config/env.config";
import crypto from "crypto";

export class EsewaService {
  async initializePayment(amount: number, transactionUuid: string) {
    const { signature, signedFields } = EsewaUtil.createSignature(
      amount,
      transactionUuid,
    );

    return { signature, signedFields };
  }

  async verifyPayment(encodedData: string) {
    try {
      const decodedString = Buffer.from(encodedData, "base64").toString(
        "utf-8",
      );
      const decodedData = JSON.parse(decodedString);
      console.log(
        "🚀 ~ EsewaService ~ verifyPayment ~ decodedData:",
        decodedData,
      );
const total_amount = decodedData.total_amount.replace(/,/g, '');

  
      const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${process.env.ESEWA_PRODUCT_CODE},signed_field_names=${decodedData.signed_field_names}`;
      let headersList = {
        Accept: "application/json",
        "Content-Type": "application/json",
      };
     
      let reqOptions = {
        url: `${DotenvConfig.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${decodedData.total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
        method: "GET",
        headers: headersList,
      };
      let response = await axios.request(reqOptions);
      console.log("🚀 ~ EsewaService ~ verifyPayment ~ response:", response);

      if (
        response.data.status !== "COMPLETE" ||
        response.data.transaction_uuid !== decodedData.transaction_uuid ||
        Number(response.data.total_amount) !== Number(total_amount)
      ) {
        throw new Error("Payment verification failed");
      }

      return { verifiedData: response.data, decodedData };
    } catch (error:any) {
      console.log("🚀 ~ EsewaService ~ verifyPayment ~ error:", error.message);
    }
  }
}
