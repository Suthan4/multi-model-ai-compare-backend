import { comparisonService } from "../services/comparision.service";
import { MODEL_INFO } from "../constants/models";
import { GraphQLError, GraphQLScalarType, Kind } from "graphql";

const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  serialize(value: any) {
    return value;
  },
  parseValue(value: any) {
    return value;
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.OBJECT) {
      return JSON.parse(JSON.stringify(ast));
    }
    return null;
  },
});

export const resolvers = {
  JSON: JSONScalar,

  Query: {
    comparison: async (_: any, { id }: { id: string }) => {
      const comparison = await comparisonService.getComparison(id);
      if (!comparison) {
        throw new GraphQLError("Comparison not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return comparison;
    },

    comparisons: async () => {
      const getAllComparisions = await comparisonService.getAllComparison();
        if (!getAllComparisions || getAllComparisions.length === 0) {
          throw new GraphQLError("No comparisons found", {
            extensions: { code: "NOT_FOUND" },
          });
        }
      return getAllComparisions;
    },

    comparisonByShareId: async (_: any, { shareId }: { shareId: string }) => {
      const comparison = await comparisonService.getComparisonByShareId(
        shareId
      );
      if (!comparison) {
        throw new GraphQLError("Shared comparison not found", {
          extensions: { code: "NOT_FOUND" },
        });
      }
      return comparison;
    },

    recentComparisons: async (_: any, { limit = 10 }: { limit?: number }) => {
      return await comparisonService.getRecentComparisons(limit);
    },

    stats: async () => {
      return await comparisonService.getStats();
    },

    availableModels: () => {
      return Object.entries(MODEL_INFO).map(([id, info]) => ({
        id,
        ...info,
      }));
    },
  },

  Mutation: {
    createComparison: async (
      _: any,
      { input }: { input: { prompt: string; models: string[] } }
    ) => {
      const { prompt, models } = input;

      if (!prompt || prompt.trim().length === 0) {
        throw new GraphQLError("Prompt is required", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      if (!models || models.length === 0 || models.length > 5) {
        throw new GraphQLError("1-5 models required", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      return await comparisonService.createComparison(prompt, models);
    },

    shareComparison: async (_: any, { id }: { id: string }) => {
      const shareId = await comparisonService.shareComparison(id);
      return {
        shareId,
        shareUrl: `${
          process.env.FRONTEND_URL || "http://localhost:3000"
        }/share/${shareId}`,
      };
    },

    deleteComparison: async (_: any, { id }: { id: string }) => {
      return await comparisonService.deleteComparison(id);
    },
  },

  Comparison: {
    id: (parent: any) => parent._id?.toString() || parent.id,
    createdAt: (parent: any) => parent.createdAt?.toISOString(),
    updatedAt: (parent: any) => parent.updatedAt?.toISOString(),
  },
};
