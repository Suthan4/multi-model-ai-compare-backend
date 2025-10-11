export const typeDefs = `
  type Query {
    comparison(id: ID!): Comparison
    comparisons:[Comparison!]!
    comparisonByShareId(shareId: String!): Comparison
    recentComparisons(limit: Int): [Comparison!]!
    stats: Stats!
    availableModels: [ModelInfo!]!
  }

  type Mutation {
    createComparison(input: CreateComparisonInput!): Comparison!
    shareComparison(id: ID!): ShareResult!
    deleteComparison(id: ID!): Boolean!
  }

  input CreateComparisonInput {
    prompt: String!
    models: [String!]!
  }

  type Comparison {
    id: ID!
    prompt: String!
    models: [String!]!
    responses: [ModelResponse!]!
    status: ComparisonStatus!
    shareId: String
    isPublic: Boolean!
    totalResponseTime: Int!
    createdAt: String!
    updatedAt: String!
  }

  type ModelResponse {
    model: String!
    provider: String!
    response: String!
    tokenCount: Int!
    responseTime: Int!
    error: String
    metadata: JSON
  }

  enum ComparisonStatus {
    pending
    processing
    completed
    failed
  }

  type ShareResult {
    shareId: String!
    shareUrl: String!
  }

  type Stats {
    totalComparisons: Int!
    avgResponseTime: Float!
    completedComparisons: Int!
    failedComparisons: Int!
  }

  type ModelInfo {
    id: String!
    name: String!
    provider: String!
    contextWindow: Int!
    description: String!
  }

  scalar JSON
`;
