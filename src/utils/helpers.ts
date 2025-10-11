import crypto from "crypto";

export const generateShareId = (): string => {
  return crypto.randomBytes(8).toString("hex");
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const isValidObjectId = (id: string): boolean => {
  return /^[a-f\d]{24}$/i.test(id);
};
