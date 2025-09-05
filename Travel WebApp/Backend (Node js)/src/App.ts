import { ExpressServer } from './ExpressServer';
import { Environment } from './Environment';
import logger from '@/utils/logger';
import express from 'express';

export class Application {
  public static async createApplication() {
    const expressServer = new ExpressServer();
    const router = express.Router();

    await expressServer.setup(Environment.getPort(),router);
    Application.handleExit(expressServer);

    return expressServer;
  }

  private static handleExit(express: ExpressServer) {
    process.on('uncaughtException', (err: Error) => {
      console.error('Uncaught exception', err.message);
      logger.error('Uncaught exception', err.message);
      Application.shutdownProperly(1, express);
    });
    process.on('unhandledRejection', (reason: {} | null | undefined) => {
      logger.error('Unhandled Rejection at promise', reason);
      Application.shutdownProperly(2, express);
    });
    process.on('SIGINT', () => {
      logger.info('Caught SIGINT');
      Application.shutdownProperly(128 + 2, express);
    });
    process.on('SIGTERM', () => {
      logger.info('Caught SIGTERM');
      Application.shutdownProperly(128 + 2, express);
    });
    process.on('exit', () => {
      logger.info('Exiting');
    });
  }

  private static shutdownProperly(exitCode: number, express: ExpressServer) {
    Promise.resolve()
      .then(() => express.kill())
      .then(() => {
        logger.info('Shutdown complete');
        process.exit(exitCode);
      })
      .catch(err => {
        logger.error('Error during shutdown', err.message);
        process.exit(1);
      });
  }
}
