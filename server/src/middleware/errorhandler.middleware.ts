import { DotenvConfig } from '../config/env.config';
export const errorHandler = (error: any) => {
  console.log("🚀 ~ formatError ~ error:", error);

  let statusCode = 500;
  let message = "Internal server error";

  if (error?.isOperational || error?.isCustom) {
    statusCode = error?.extensions?.exception?.statusCode || 500;
    message = error?.message || message;
  }

  return {
    message,
    statusCode,
    ...(DotenvConfig.DEBUG_MODE === "true" && { original: error.message }),
  };
};
