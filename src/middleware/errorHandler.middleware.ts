import { ErrorRequestHandler, Response, Request, NextFunction } from "express";
import { AppError } from "../utils/appError";
import z from "zod";
import { HTTP_STATUS } from "../constants/https";

const handleZodError = (res: Response, error: z.ZodError) => {
  const errors = error.issues.map((err) => ({
    path: err.path.join("."),
    message: err.message,
  }));
  return res.status(HTTP_STATUS.BAD_REQUEST).json({
    message: error.message,
    errors,
  });
};

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.log(`PATH:${req.path}`, error);
  // zod validation errors
  if (error instanceof z.ZodError) {
    return handleZodError(res, error);
  }
  // Our custom error
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    });
  }
  // Fallback
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorHandler;
