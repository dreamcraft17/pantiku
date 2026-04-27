import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/api-error.js";
import { errorResponse } from "../utils/response.js";
import { env } from "../config/env.js";

export function notFoundHandler(_req: Request, res: Response) {
  return errorResponse(res, "Route not found", 404, "NOT_FOUND");
}

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (env.NODE_ENV !== "production") {
    console.error(error);
  }

  if (error instanceof ZodError) {
    return errorResponse(res, "Validation failed", 400, "VALIDATION_ERROR", error.flatten());
  }

  if (error instanceof ApiError) {
    return errorResponse(res, error.message, error.statusCode, error.code, error.details);
  }

  if (error instanceof Error) {
    const message = env.NODE_ENV === "production" ? "Application error" : error.message;
    return errorResponse(res, message, 400, "APP_ERROR");
  }

  return errorResponse(res, "Internal server error", 500, "INTERNAL_SERVER_ERROR");
}
