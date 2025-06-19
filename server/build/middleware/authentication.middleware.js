"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.authentication = void 0;
const webToken_service_1 = __importDefault(
  require("../service/webToken.service"),
);
const HttpException_utils_1 = __importDefault(
  require("../utils/HttpException.utils"),
);
const env_config_1 = require("../config/env.config");
const authentication = async ({ context }, next) => {
  const tokens = context.req.headers.authorization?.split(" ");
  try {
    if (!tokens) {
      throw new Error("You are not authorized1234");
    }
    const mode = tokens[0];
    const accessToken = tokens[1];
    if (mode !== "Bearer" || !accessToken) {
      throw new Error("You are not authorized");
    }
    const payload = webToken_service_1.default.verify(
      accessToken,
      env_config_1.DotenvConfig.ACCESS_TOKEN_SECRET,
    );
    if (payload) {
      context.req.user = payload;
      return next();
    } else {
      throw HttpException_utils_1.default.unauthorized(
        "You are not authorized",
      );
    }
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw HttpException_utils_1.default.badRequest(
        "Token Expired, Please sign in again",
      );
    }
    throw new Error("You are not authorized");
  }
};
exports.authentication = authentication;
