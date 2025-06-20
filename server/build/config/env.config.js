"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.DotenvConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
  path: path_1.default.resolve(process.cwd(), ".env"),
});
class DotenvConfig {
  static NODE_ENV = process.env.NODE_ENV;
  static PORT = process.env.PORT;
  static DATABASE_HOST = process.env.DATABASE_HOST;
  static DATABASE_PORT = +process.env.DATABASE_PORT;
  static DATABASE_USERNAME = process.env.DATABASE_USERNAME;
  static DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
  static DATABASE_NAME = process.env.DATABASE_NAME;
  static ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
  static ACCESS_TOKEN_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN;
  static REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
  static REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN;
  static API_KEY = process.env.API_KEY;
  static DEBUG_MODE = process.env.DEBUG_MODE;
  static OTP_SECRET = process.env.OTP_SECRET;
  static MAIL_HOST = process.env.MAIL_HOST;
  static MAIL_AUTH = process.env.MAIL_AUTH;
  static MAIL_PASSWORD = process.env.MAIL_PASSWORD;
  static MAIL_PORT = process.env.MAIL_PORT;
  static MAIL_USERNAME = process.env.MAIL_USERNAME;
  static MAIL_FROM = process.env.MAIL_FROM;
  static BASE_URL = process.env.BASE_URL;
  static STRIPE_SECRET = process.env.STRIPE_SECRET;
  static CORS_ORIGIN = process.env.CORS_ORIGIN.split(",") || [];
  static FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
  static FACEBOOK_SECRET = process.env.FACEBOOK_SECRET;
  static ADMIN_NAME = process.env.ADMIN_NAME;
  static ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  static ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  static ESEWA_SECRET_KEY = process.env.ESEWA_SECRET;
  static ESEWA_PRODUCT_CODE = process.env.ESEWA_PRODUCT_CODE;
  static ESEWA_SUCCESS_URL = process.env.ESEWA_SUCCESS_URL;
  static ESEWA_FAILURE_URL = process.env.ESEWA_FAILURE_URL;
  static ESEWA_GATEWAY_URL = process.env.ESEWA_GATEWAY_URL;
  static ESEWAPAYMENT_URL = process.env.ESEWAPAYMENT_URL;
  static ESEWAPAYMENT_STATUS_CHECK_URL =
    process.env.ESEWAPAYMENT_STATUS_CHECK_URL;
  static KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;
  static KHALTI_GATEWAY_URL = process.env.KHALTI_GATEWAY_URL;
}
exports.DotenvConfig = DotenvConfig;
