import express, { Application, Response } from "express";
import cors from "cors";
import compression from "compression";
import { createHandler } from "graphql-http/lib/use/express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import routes from "./routes/index";

import {
  generalLimiter,
  graphqlLimiter,
} from "./middleware/rate-limit.middleware";
import { logger } from "./utils/logger";
import { APP_ORIGIN, PORT } from "./constants/env";
import errorHandler from "./middleware/errorHandler.middleware";
import { HTTP_STATUS } from "./constants/https";

export const createApp = (): Application => {
  const app = express();

  app.use(
    cors({
      origin: APP_ORIGIN.split(","),
      credentials: true,
    })
  );

  app.use(compression());
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));
  app.use("/api", generalLimiter);

  app.get("/", (_, res: Response) => {
    return res.status(HTTP_STATUS.OK).json({
      success: "ok",
      message: "server running successfully",
      timestamp: new Date().toISOString(),
    });
  });

  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  // GraphQL Schema
  const executableSchema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  // GraphQL Playground (for browser access)
  app.get("/graphql", (req, res) => {
    res.type("html");
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GraphQL Playground</title>
          <style>
            body {
              margin: 0;
              padding: 20px;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
              background: #1a1a1a;
              color: #fff;
            }
            .container {
              max-width: 1200px;
              margin: 0 auto;
            }
            h1 { color: #e535ab; }
            .endpoint {
              background: #2a2a2a;
              padding: 20px;
              border-radius: 8px;
              margin: 20px 0;
            }
            pre {
              background: #1e1e1e;
              padding: 15px;
              border-radius: 4px;
              overflow-x: auto;
              border-left: 3px solid #e535ab;
            }
            code { color: #9cdcfe; }
            .method { color: #4ec9b0; font-weight: bold; }
            a { color: #569cd6; text-decoration: none; }
            a:hover { text-decoration: underline; }
            .note {
              background: #264f78;
              padding: 10px 15px;
              border-radius: 4px;
              margin: 10px 0;
              border-left: 3px solid #569cd6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🚀 GraphQL API - Multi-Model AI Comparison</h1>
            
            <div class="note">
              📝 <strong>Note:</strong> This GraphQL endpoint requires POST requests. Use curl, Postman, or any GraphQL client.
            </div>

            <div class="endpoint">
              <h2>Endpoint</h2>
              <p><span class="method">POST</span> <code>http://localhost:${PORT}/graphql</code></p>
            </div>

            <div class="endpoint">
              <h2>📌 Example: Get Available Models</h2>
              <pre><code>curl -X POST http://localhost:${PORT}/graphql \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "{ availableModels { id name provider contextWindow description } }"
  }'</code></pre>
            </div>

            <div class="endpoint">
              <h2>📌 Example: Create Comparison</h2>
              <pre><code>curl -X POST http://localhost:${PORT}/graphql \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "mutation { createComparison(input: { prompt: \\"What is AI?\\", models: [\\"llama3-8b-8192\\", \\"mixtral-8x7b-32768\\"] }) { id prompt status responses { model response responseTime tokenCount } } }"
  }'</code></pre>
            </div>

            <div class="endpoint">
              <h2>📌 Example: Get Comparison by ID</h2>
              <pre><code>curl -X POST http://localhost:${PORT}/graphql \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "query { comparison(id: \\"YOUR_COMPARISON_ID\\") { id prompt status responses { model response responseTime tokenCount } } }"
  }'</code></pre>
            </div>

            <div class="endpoint">
              <h2>📌 Example: Get Stats</h2>
              <pre><code>curl -X POST http://localhost:${PORT}/graphql \\
  -H "Content-Type: application/json" \\
  -d '{
    "query": "{ stats { totalComparisons avgResponseTime completedComparisons failedComparisons } }"
  }'</code></pre>
            </div>

            <div class="endpoint">
              <h2>🔗 REST API Alternative</h2>
              <p>Prefer REST? Try these endpoints:</p>
              <ul>
                <li><a href="http://localhost:${PORT}/health" target="_blank">GET /health</a> - Health check</li>
                <li><a href="http://localhost:${PORT}/api/models" target="_blank">GET /api/models</a> - Available models</li>
                <li><a href="http://localhost:${PORT}/api/stats" target="_blank">GET /api/stats</a> - Statistics</li>
                <li>POST /api/comparisons - Create comparison</li>
              </ul>
            </div>

            <div class="endpoint">
              <h2>📚 GraphQL Schema</h2>
              <p>Available queries and mutations:</p>
              <pre><code>Query:
  - availableModels: [ModelInfo!]!
  - comparison(id: ID!): Comparison
  - comparisonByShareId(shareId: String!): Comparison
  - recentComparisons(limit: Int): [Comparison!]!
  - stats: Stats!

Mutation:
  - createComparison(input: CreateComparisonInput!): Comparison!
  - shareComparison(id: ID!): ShareResult!
  - deleteComparison(id: ID!): Boolean!</code></pre>
            </div>
          </div>
        </body>
      </html>
    `);
  });

  // GraphQL POST endpoint
  app.post(
    "/graphql",
    graphqlLimiter,
    createHandler({
      schema: executableSchema,
    })
  );

  // REST API routes
  app.use(routes);

  // Error handlers
  app.use(errorHandler);

  return app;
};

export default createApp;
