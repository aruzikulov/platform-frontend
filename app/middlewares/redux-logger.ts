import { Middleware } from "redux";
import { ILogger } from "../lib/dependencies/Logger";

export const reduxLogger = (logger: ILogger): Middleware => {
  return () => {
    return next => (action: any) => {
      logger.info(`[redux-action] ${action.type}`);

      return next(action);
    };
  };
};
