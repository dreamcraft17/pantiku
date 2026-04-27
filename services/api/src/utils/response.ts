import { Response } from "express";

type Meta = Record<string, unknown>;

export function successResponse<T>(res: Response, data: T, message = "OK", meta?: Meta, statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    ...(meta ? { meta } : {})
  });
}

export function errorResponse(res: Response, message: string, statusCode = 400, code?: string, details?: unknown) {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(code ? { code } : {}),
    ...(details ? { details } : {})
  });
}
