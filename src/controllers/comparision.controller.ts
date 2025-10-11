import { Request, Response, NextFunction } from "express";
import { comparisonService } from "../services/comparision.service";
import { z } from "zod";
import { MODEL_INFO } from "../constants/models";
import { HTTP_STATUS } from "../constants/https";

const createComparisonSchema = z.object({
  prompt: z.string().min(1).max(10000),
  models: z.array(z.string()).min(1).max(5),
});

export class ComparisonController {
  async createComparison(req: Request, res: Response, next: NextFunction) {
    try {
      const validation = createComparisonSchema.parse(req.body);

      const validModels = Object.keys(MODEL_INFO);
      const invalidModels = validation.models.filter(
        (m) => !validModels.includes(m)
      );

      if (invalidModels.length > 0) {
        return res.status(400).json({
          error: "Invalid models",
          invalidModels,
        });
      }

      const comparison = await comparisonService.createComparison(
        validation.prompt,
        validation.models
      );

      res.status(HTTP_STATUS.CREATED).json({
        success: true,
        data: comparison,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllComparision(req: Request, res: Response, next: NextFunction) {
    try {
      const comparisons = await comparisonService.getAllComparison();
      if (comparisons.length === 0) {
        return res.status(404).json({
          error: "No comparisons found",
        });
      }
      res.json({
        success: true,
        data: comparisons,
      });
    } catch (error) {
      next(error);
    }
  }

  async getComparison(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const comparison = await comparisonService.getComparison(id);

      if (!comparison) {
        return res.status(404).json({
          error: "Comparison not found",
        });
      }

      res.json({
        success: true,
        data: comparison,
      });
    } catch (error) {
      next(error);
    }
  }

  async getComparisonByShareId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { shareId } = req.params;
      const comparison = await comparisonService.getComparisonByShareId(
        shareId
      );

      if (!comparison) {
        return res.status(404).json({
          error: "Shared comparison not found",
        });
      }

      res.json({
        success: true,
        data: comparison,
      });
    } catch (error) {
      next(error);
    }
  }

  async getRecentComparisons(req: Request, res: Response, next: NextFunction) {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const comparisons = await comparisonService.getRecentComparisons(limit);

      res.json({
        success: true,
        data: comparisons,
      });
    } catch (error) {
      next(error);
    }
  }

  async shareComparison(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const shareId = await comparisonService.shareComparison(id);

      const shareUrl = `${req.protocol}://${req.get(
        "host"
      )}/api/v1/comparisons/share/${shareId}`;

      res.json({
        success: true,
        data: {
          shareId,
          shareUrl,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteComparison(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const deleted = await comparisonService.deleteComparison(id);

      if (!deleted) {
        return res.status(404).json({
          error: "Comparison not found",
        });
      }

      res.json({
        success: true,
        message: "Comparison deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const stats = await comparisonService.getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAvailableModels(req: Request, res: Response, next: NextFunction) {
    try {
      const models = Object.entries(MODEL_INFO).map(([id, info]) => ({
        id,
        ...info,
      }));

      res.json({
        success: true,
        data: models,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const comparisonController = new ComparisonController();
