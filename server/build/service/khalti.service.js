"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const env_config_1 = require("../config/env.config");
const HttpException_utils_1 = __importDefault(
  require("../utils/HttpException.utils"),
);
class KhaltiService {
  constructor() {}
  async verifyPayment(pidx) {
    const headersList = {
      Authorization: `Key ${env_config_1.DotenvConfig.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    };
    console.log(pidx, "iiiiad");
    const bodyContent = JSON.stringify({ pidx });
    console.log(
      "🚀 ~ KhaltiService ~ verifyPayment ~ bodyContent:",
      bodyContent,
    );
    const reqOptions = {
      url: `${env_config_1.DotenvConfig.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };
    console.log("🚀 ~ KhaltiService ~ verifyPayment ~ reqOptions:", reqOptions);
    try {
      const response = await axios_1.default.request(reqOptions);
      console.log(
        "🚀 ~ KhaltiService ~ verifyPayment ~ response:",
        response.data,
      );
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        throw HttpException_utils_1.default.badRequest(error.message);
      } else {
        throw HttpException_utils_1.default.internalServerError(
          "Error occured",
        );
      }
    }
  }
  async initializeKhaltiPayment(details) {
    console.log(
      "🚀 ~ KhaltiService ~ initializeKhaltiPayment ~ details:",
      details,
    );
    const headersList = {
      Authorization: `Key ${env_config_1.DotenvConfig.KHALTI_SECRET_KEY}`,
      "Content-Type": "application/json",
    };
    const bodyContent = JSON.stringify(details);
    console.log(
      "🚀 ~ KhaltiService ~ initializeKhaltiPayment ~ bodyContent:",
      bodyContent,
    );
    const reqOptions = {
      url: `${env_config_1.DotenvConfig.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
      method: "POST",
      headers: headersList,
      data: bodyContent,
    };
    console.log(
      "🚀 ~ KhaltiService ~ initializeKhaltiPayment ~ reqOptions:",
      reqOptions,
    );
    try {
      const response = await axios_1.default.request(reqOptions);
      return response.data;
    } catch (error) {
      console.error("Error initializing Khalti payment:", error);
      throw error;
    }
  }
}
exports.default = new KhaltiService();
