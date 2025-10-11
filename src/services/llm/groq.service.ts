import Groq from "groq-sdk";
import {
  BaseLLMService,
  LLMResponse,
  LLMServiceOptions,
} from "./base.service";
import { AI_PROVIDERS } from "../../constants/models";
import { logger } from "../../utils/logger";
import { GROQ_API_KEY } from "../../constants/env";

export class GroqService extends BaseLLMService {
  private client: Groq;

  constructor(apiKey: string) {
    super(apiKey, AI_PROVIDERS.GROQ);
    this.client = new Groq({ apiKey });
  }

  async generate(
    prompt: string,
    model: string,
    options: LLMServiceOptions = {}
  ): Promise<LLMResponse> {
    try {
      const [completion, responseTime] = await this.measureTime(async () => {
        return await this.client.chat.completions.create({
          model,
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 1024,
          top_p: options.topP ?? 1,
          stream: false,
        });
      });

      const content = completion.choices[0]?.message?.content || "";
      const tokenCount = completion.usage?.total_tokens || 0;

      logger.info(`Groq ${model} response generated in ${responseTime}ms`);

      return this.createResponse(model, content, tokenCount, responseTime, {
        finishReason: completion.choices[0]?.finish_reason,
        promptTokens: completion.usage?.prompt_tokens,
        completionTokens: completion.usage?.completion_tokens,
      });
    } catch (error: any) {
      logger.error(`Groq ${model} error:`, error);
      return this.createErrorResponse(
        model,
        error.message || "Failed to generate response"
      );
    }
  }

  isAvailable(): boolean {
    return !!this.apiKey;
  }
}

export const groqService = new GroqService(GROQ_API_KEY || "");
