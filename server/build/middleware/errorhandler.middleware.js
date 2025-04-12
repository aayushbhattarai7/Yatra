"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
  console.log("🚀 ~ errorHandler ~ error:", error);
  let statusCode = 500;
  let data = {
    success: false,
    message: "error",
    ...(process.env.DEBUG_MODE === "true" && { original: error.message }),
  };
  if (error?.isOperational || error?.isCustom) {
    statusCode = error.statusCode;
    data = {
      ...data,
      message: error.message,
    };
  }
  res.status(statusCode).json(data);
};
exports.errorHandler = errorHandler;
