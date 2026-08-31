import { NextResponse } from "next/server";

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "AUTHORIZATION_ERROR"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "GITHUB_ERROR"
  | "AI_PROVIDER_ERROR"
  | "REPOSITORY_ERROR"
  | "SANDBOX_ERROR"
  | "SANDBOX_SECURITY_VIOLATION"
  | "PATCH_ERROR"
  | "TEST_EXECUTION_ERROR"
  | "SECURITY_SCAN_ERROR"
  | "DATABASE_ERROR"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public statusCode: number,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: ErrorCode;
    message: string;
    requestId: string;
    details?: unknown;
  };
}

export function handleApiError(error: unknown, requestId: string = `req_${Math.random().toString(36).substring(2, 9)}`): NextResponse<ApiErrorResponse> {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          requestId,
          details: error.details,
        },
      },
      { status: error.statusCode }
    );
  }

  // Generic fallback without exposing internal stack traces
  const message = error instanceof Error ? error.message : "An unexpected internal error occurred.";
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "Internal server error. Please try again later.",
        requestId,
      },
    },
    { status: 500 }
  );
}
