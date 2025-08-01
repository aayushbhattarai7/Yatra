import axios from "axios";
import { DotenvConfig } from "../config/env.config";
import HttpException from "../utils/HttpException.utils";
class KhaltiService {
  constructor() {}
  async verifyPayment(pidx: any) {
    const headersList = {
      Authorization: `Key ${DotenvConfig.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json"};
    const bodyContent = JSON.stringify({ pidx });
    const reqOptions = {
      url: `${DotenvConfig.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };
    try {
      const response = await axios.request(reqOptions);
      return response.data;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(error);
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.internalServerError("Error occured");
      }
    }
  }

  async initializeKhaltiPayment(details: any) {
    console.log("🚀 ~ KhaltiService ~ initializeKhaltiPayment ~ details:", details)
    const headersList = {
      Authorization: `Key ${DotenvConfig.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    };
    const bodyContent = JSON.stringify(details);
    console.log(
      "🚀 ~ KhaltiService ~ initializeKhaltiPayment ~ bodyContent:",
      bodyContent,
    );
    const reqOptions = {
      url: `${DotenvConfig.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };
    try {
      const response = await axios.request(reqOptions);
      return response.data;
    } catch (error: any) {
      console.error("Error initializing Khalti payment:", error.message);
      throw error;
    }
  }
}
export default new KhaltiService();
