import dotenv from "dotenv";

dotenv.config({});

const getEnv = (key: string, defaultVlaue?: string): string => {
  const value = process.env[key] || defaultVlaue;
  if (value === undefined) {
    throw new Error(`Missing environment value ${key}`);
  }
  return value;
};

export const NODE_ENV = getEnv("NODE_ENV", "development");
export const PORT = getEnv("PORT", "5005");
export const MONGODB_URI = getEnv("MONGODB_URI");
export const APP_ORIGIN = getEnv("APP_ORIGIN", "http://localhost:3000");
export const API_VERSION = getEnv("API_VERSION");
export const RATE_LIMIT_WINDOW_MS = getEnv("RATE_LIMIT_WINDOW_MS");
export const RATE_LIMIT_MAX_REQUESTS = getEnv("RATE_LIMIT_MAX_REQUESTS");
export const GROQ_API_KEY = getEnv("GROQ_API_KEY");
export const FRONTEND_URL = getEnv("FRONTEND_URL");