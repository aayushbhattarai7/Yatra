"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const generateHash_1 = require("../utils/generateHash");
const env_config_1 = require("../config/env.config");
class EsewaService {
    async initializePayment(amount, transactionUuid) {
        const { signature, signedFields } = generateHash_1.EsewaUtil.createSignature(amount, transactionUuid);
        return { signature, signedFields };
    }
    async verifyPayment(encodedData) {
        try {
            const decodedString = Buffer.from(encodedData, "base64").toString("utf-8");
            const decodedData = JSON.parse(decodedString);
            const total_amount = decodedData.total_amount.replace(/,/g, "");
            let headersList = {
                Accept: "application/json",
                "Content-Type": "application/json",
            };
            let reqOptions = {
                url: `${env_config_1.DotenvConfig.ESEWA_GATEWAY_URL}/api/epay/transaction/status/?product_code=${process.env.ESEWA_PRODUCT_CODE}&total_amount=${total_amount}&transaction_uuid=${decodedData.transaction_uuid}`,
                method: "GET",
                headers: headersList,
            };
            let response = await axios_1.default.request(reqOptions);
            if (response.data.status !== "COMPLETE" ||
                response.data.transaction_uuid !== decodedData.transaction_uuid ||
                Number(response.data.total_amount) !== Number(total_amount)) {
                throw new Error("Payment verification failed");
            }
            return { verifiedData: response.data, decodedData };
        }
        catch (error) {
            console.log("🚀 ~ EsewaService ~ verifyPayment ~ error:", error.message);
        }
    }
}
exports.default = new EsewaService();
