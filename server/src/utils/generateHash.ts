import { DotenvConfig } from "../config/env.config";
import crypto from "crypto";

export class EsewaUtil {
  static createSignature(
    amount: number,
    transactionUuid: string,
  ): { signature: string; signedFields: string } {
    const productCode = DotenvConfig.ESEWA_PRODUCT_CODE!;
    const secretKey = DotenvConfig.ESEWA_SECRET_KEY!;

    const data = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

    const signature = crypto
      .createHmac("sha256", secretKey)
      .update(data)
      .digest("base64");

    return {
      signature,
      signedFields: "total_amount,transaction_uuid,product_code",
    };
  }

  static verifySignature(decodedData: any): string {
    const productCode = DotenvConfig.ESEWA_PRODUCT_CODE!;
    const secretKey = DotenvConfig.ESEWA_SECRET_KEY!;

    const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${productCode},signed_field_names=${decodedData.signed_field_names}`;

    return crypto.createHmac("sha256", secretKey).update(data).digest("base64");
  }
}
