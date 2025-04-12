"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EsewaUtil = void 0;
const env_config_1 = require("../config/env.config");
const crypto_1 = __importDefault(require("crypto"));
class EsewaUtil {
    static createSignature(amount, transactionUuid) {
        const productCode = env_config_1.DotenvConfig.ESEWA_PRODUCT_CODE;
        const secretKey = env_config_1.DotenvConfig.ESEWA_SECRET_KEY;
        const data = `total_amount=${amount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
        const signature = crypto_1.default
            .createHmac("sha256", secretKey)
            .update(data)
            .digest("base64");
        return {
            signature,
            signedFields: "total_amount,transaction_uuid,product_code",
        };
    }
    static verifySignature(decodedData) {
        const productCode = env_config_1.DotenvConfig.ESEWA_PRODUCT_CODE;
        const secretKey = env_config_1.DotenvConfig.ESEWA_SECRET_KEY;
        const data = `transaction_code=${decodedData.transaction_code},status=${decodedData.status},total_amount=${decodedData.total_amount},transaction_uuid=${decodedData.transaction_uuid},product_code=${productCode},signed_field_names=${decodedData.signed_field_names}`;
        return crypto_1.default.createHmac("sha256", secretKey).update(data).digest("base64");
    }
}
exports.EsewaUtil = EsewaUtil;
