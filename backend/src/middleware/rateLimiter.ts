import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

// General API rate limiter
export const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    error: {
      code: 'AUTH_RATE_LIMIT',
      message: 'Too many authentication attempts, please try again later',
    },
  },
  skipSuccessfulRequests: true,
});

// Very strict rate limiter for code execution
export const executionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 3, // 3 executions per minute
  message: {
    success: false,
    error: {
      code: 'EXECUTION_RATE_LIMIT',
      message: 'Too many execution requests, please try again later',
    },
  },
});
