import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
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
