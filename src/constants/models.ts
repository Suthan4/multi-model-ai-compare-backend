export const AI_PROVIDERS = {
  GROQ: "groq",
  OPENAI: "openai",
  ANTHROPIC: "anthropic",
} as const;

export type AIProvider = (typeof AI_PROVIDERS)[keyof typeof AI_PROVIDERS];

export const GROQ_MODELS = {
  LLAMA_3_1_8B: "llama-3.1-8b-instant",
  LLAMA_3_3_70B: "llama-3.3-70b-versatile",
  LLAMA_GUARD_4_12B: "meta-llama/llama-guard-4-12b",
  GPT_OSS_120B: "openai/gpt-oss-120b",
  GPT_OSS_20B: "openai/gpt-oss-20b",
} as const;

export const MODEL_INFO = {
  [GROQ_MODELS.LLAMA_3_1_8B]: {
    name: "Llama 3.1 8B Instant",
    provider: AI_PROVIDERS.GROQ,
    contextWindow: 131072,
    description: "Fast Llama 3.1 8B - Instant responses with 131K context",
  },
  [GROQ_MODELS.LLAMA_3_3_70B]: {
    name: "Llama 3.3 70B Versatile",
    provider: AI_PROVIDERS.GROQ,
    contextWindow: 131072,
    description: "Most capable Llama 3.3 70B with 131K context window",
  },
  [GROQ_MODELS.LLAMA_GUARD_4_12B]: {
    name: "Llama Guard 4 12B",
    provider: AI_PROVIDERS.GROQ,
    contextWindow: 131072,
    description: "Content moderation and safety model",
  },
  [GROQ_MODELS.GPT_OSS_120B]: {
    name: "GPT OSS 120B",
    provider: AI_PROVIDERS.GROQ,
    contextWindow: 131072,
    description: "Open source GPT model with 120B parameters",
  },
  [GROQ_MODELS.GPT_OSS_20B]: {
    name: "GPT OSS 20B",
    provider: AI_PROVIDERS.GROQ,
    contextWindow: 131072,
    description: "Faster open source GPT model with 20B parameters",
  },
} as const;

export const COMPARISON_STATUS = {
  PENDING: "pending",
  PROCESSING: "processing",
  COMPLETED: "completed",
  FAILED: "failed",
} as const;

export type ComparisonStatus =
  (typeof COMPARISON_STATUS)[keyof typeof COMPARISON_STATUS];
