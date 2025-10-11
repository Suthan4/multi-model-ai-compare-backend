import { comparisonRepository } from "../repositories/comparision.repositories";
import { IComparison, IModelResponse } from "../models/comparisions.model";
import { COMPARISON_STATUS } from "../constants/models";
import { groqService } from "./llm/groq.service";
import { logger } from "../utils/logger";
import { generateShareId } from "../utils/helpers";

export class ComparisonService {
  async createComparison(
    prompt: string,
    models: string[],
    userId?: string
  ): Promise<IComparison> {
    const comparison = await comparisonRepository.create({
      prompt,
      models,
      status: COMPARISON_STATUS.PENDING,
      responses: [],
      createdBy: "1",
    });

    this.processComparison(comparison._id.toString(), prompt, models).catch(
      (err) => {
        logger.error("Error processing comparison:", err);
      }
    );

    return comparison;
  }

  private async processComparison(
    comparisonId: string,
    prompt: string,
    models: string[]
  ): Promise<void> {
    try {
      await comparisonRepository.updateStatus(
        comparisonId,
        COMPARISON_STATUS.PROCESSING
      );

      const responses: IModelResponse[] = [];
      let totalTime = 0;

      const promises = models.map((model) =>
        groqService.generate(prompt, model)
      );
      const results = await Promise.allSettled(promises);

      results.forEach((result, index) => {
        if (result.status === "fulfilled") {
          const response = result.value;
          responses.push(response);
          totalTime += response.responseTime;
        } else {
          logger.error(`Model ${models[index]} failed:`, result.reason);
          responses.push({
            model: models[index],
            provider: "groq",
            response: "",
            tokenCount: 0,
            responseTime: 0,
            error: result.reason.message || "Unknown error",
          });
        }
      });

      await comparisonRepository.update(comparisonId, {
        responses,
        totalResponseTime: totalTime,
        status: COMPARISON_STATUS.COMPLETED,
      });

      logger.info(`Comparison ${comparisonId} completed in ${totalTime}ms`);
    } catch (error) {
      logger.error("Error in processComparison:", error);
      await comparisonRepository.updateStatus(
        comparisonId,
        COMPARISON_STATUS.FAILED
      );
    }
  }

  async getComparison(id: string): Promise<IComparison | null> {
    return await comparisonRepository.findById(id);
  }

  async getAllComparison(): Promise<IComparison[] | null> {
    return await comparisonRepository.findAll();
  }

  async getComparisonByShareId(shareId: string): Promise<IComparison | null> {
    return await comparisonRepository.findByShareId(shareId);
  }


  async getRecentComparisons(
    limit: number = 10,
    userId?: string
  ): Promise<IComparison[]> {
    return await comparisonRepository.findRecent(limit, userId);
  }

  async shareComparison(id: string): Promise<string> {
    const comparison = await comparisonRepository.findById(id);
    if (!comparison) {
      throw new Error("Comparison not found");
    }

    if (comparison.shareId) {
      return comparison.shareId;
    }

    const shareId = generateShareId();
    await comparisonRepository.update(id, {
      shareId,
      isPublic: true,
    });

    return shareId;
  }

  async deleteComparison(id: string): Promise<boolean> {
    return await comparisonRepository.delete(id);
  }

  async getStats(userId?: string): Promise<any> {
    return await comparisonRepository.getStats(userId);
  }
}

export const comparisonService = new ComparisonService();
