"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HashService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const env_config_1 = require("../config/env.config");
class HashService {
    hashOtp(data) {
        return crypto_1.default
            .createHmac("sha256", env_config_1.DotenvConfig.OTP_SECRET)
            .update(data)
            .digest("hex");
    }
}
exports.HashService = HashService;
