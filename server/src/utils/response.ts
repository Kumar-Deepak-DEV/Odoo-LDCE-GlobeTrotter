import { Response } from 'express';

export interface StandardSuccessResponse<T> {
  success: true;
  data: T;
}

export interface StandardErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    details?: unknown;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  statusCode: number = 200
): Response => {
  const responsePayload: StandardSuccessResponse<T> = {
    success: true,
    data,
  };
  return res.status(statusCode).json(responsePayload);
};

export const sendError = (
  res: Response,
  message: string,
  code: string = 'INTERNAL_ERROR',
  statusCode: number = 500,
  details?: unknown
): Response => {
  const responsePayload: StandardErrorResponse = {
    success: false,
    error: {
      message,
      code,
      ...(details !== undefined ? { details } : {}),
    },
  };
  return res.status(statusCode).json(responsePayload);
};
