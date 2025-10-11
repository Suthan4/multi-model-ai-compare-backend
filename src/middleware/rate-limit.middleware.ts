import rateLimit from "express-rate-limit";
import { RATE_LIMIT_MAX_REQUESTS, RATE_LIMIT_WINDOW_MS } from "../constants/env";

export const generalLimiter = rateLimit({
  windowMs: Number(RATE_LIMIT_WINDOW_MS),
  max: Number(RATE_LIMIT_MAX_REQUESTS),
  message: {
    success: false,
    error: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const comparisonLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    error: "Too many comparison requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const graphqlLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    errors: [
      {
        message: "Too many GraphQL requests, please try again later.",
        extensions: { code: "RATE_LIMIT_EXCEEDED" },
      },
    ],
  },
  standardHeaders: true,
  legacyHeaders: false,
});
