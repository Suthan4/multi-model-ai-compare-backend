import { AIProvider } from "../../constants/models";

export interface LLMResponse {
  model: string;
  provider: AIProvider;
  response: string;
  tokenCount: number;
  responseTime: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface LLMServiceOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  stream?: boolean;
}

export abstract class BaseLLMService {
  protected apiKey: string;
  protected provider: AIProvider;

  constructor(apiKey: string, provider: AIProvider) {
    this.apiKey = apiKey;
    this.provider = provider;
  }

  abstract generate(
    prompt: string,
    model: string,
    options?: LLMServiceOptions
  ): Promise<LLMResponse>;

  abstract isAvailable(): boolean;

  protected createResponse(
    model: string,
    response: string,
    tokenCount: number,
    responseTime: number,
    metadata?: Record<string, any>
  ): LLMResponse {
    return {
      model,
      provider: this.provider,
      response,
      tokenCount,
      responseTime,
      metadata,
    };
  }

  protected createErrorResponse(model: string, error: string): LLMResponse {
    return {
      model,
      provider: this.provider,
      response: "",
      tokenCount: 0,
      responseTime: 0,
      error,
    };
  }

  protected async measureTime<T>(fn: () => Promise<T>): Promise<[T, number]> {
    const start = Date.now();
    const result = await fn();
    const duration = Date.now() - start;
    return [result, duration];
  }
}
