import { Server } from "http";
import { AppDataSource } from "../data-source";
import logger from "../config/logger";
import { RedisClient } from "../config/redis";

export const setupGracefulShutdown = (server: Server) => {
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}.Starting graceful shutdown`);
    try {
      await new Promise<void>((resolve) => {
        server.close(() => {
          logger.info("Server closed");
          resolve();
        });
      });
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        logger.info("Database connection closed");
      }
      await RedisClient.closeConnection();
      logger.info("Graceful shutdown completed-----");
      process.exit(0);
    } catch (error) {
      logger.error("Error during shutdown", error);
      process.exit(1);
    }
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("uncaughtException", (error) => {
    logger.error("Uncaught exception", error);
    shutdown("uncaughtexception");
  });
  process.on("unhandledrejection", (reason, promise) => {
    logger.error("Uncaught rejection st", "reason:", reason);
    shutdown("uncaughtrejection");
  });
};
