import createApp from "./app";
import { database } from "./config/database";
import { PORT } from "./constants/env";
import { logger } from "./utils/logger";

const startServer = async () => {
  try {
    logger.info("Connecting to MongoDB...");
    await database.connect();
    logger.info("✅ MongoDB connected");

    const app = createApp();

    const server = app.listen(PORT, () => {
      logger.info(`
┌─────────────────────────────────────────────┐
│  🚀 Server: http://localhost:${PORT}         │
│  🌐 GraphQL: http://localhost:${PORT}/graphql│
│  📡 API: http://localhost:${PORT}/api/}     │
└─────────────────────────────────────────────┘
      `);
    });

    const gracefulShutdown = async (signal: string) => {
      logger.info(`${signal} received. Shutting down...`);

      server.close(async () => {
        await database.disconnect();
        process.exit(0);
      });

      setTimeout(() => {
        logger.error("Forced shutdown");
        process.exit(1);
      }, 30000);
    };

    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
