import {
  addBreadcrumb,
  captureException,
  configureScope,
  init,
  Severity,
  withScope,
} from "@sentry/browser";
import { injectable } from "inversify";

import { EUserType } from "../api/users/interfaces";

type LogArg = string | object;
type ErrorArgs = LogArg | Error;
type TUser = { id: string; type: EUserType };

export const resolveLogger = () => {
  if (process.env.NF_SENTRY_DSN) {
    return new SentryLogger(process.env.NF_SENTRY_DSN);
  }

  if (process.env.NODE_ENV === "production") {
    // tslint:disable-next-line
    console.info("Error logging is disabled");

    return noopLogger;
  }

  return new DevConsoleLogger();
};

export interface ILogger {
  info(...args: LogArg[]): void;
  verbose(...args: LogArg[]): void;
  debug(...args: LogArg[]): void;
  warn(...args: ErrorArgs[]): void;
  error(...args: ErrorArgs[]): void;
  setUser(user: TUser | null): void;
}

@injectable()
export class DevConsoleLogger implements ILogger {
  setUser(user: TUser | null): void {
    if (user) {
      this.info(`Logged in as ${user.type}`);
    } else {
      this.info("Logged out");
    }
  }

  info(...args: LogArg[]): void {
    // tslint:disable-next-line
    console.info(...args);
  }
  verbose(...args: LogArg[]): void {
    // tslint:disable-next-line
    console.log(...args);
  }
  debug(...args: LogArg[]): void {
    // tslint:disable-next-line
    console.log(...args);
  }
  warn(...args: ErrorArgs[]): void {
    // tslint:disable-next-line
    console.warn(...args);
  }
  error(...args: ErrorArgs[]): void {
    // tslint:disable-next-line
    console.error(...args);
  }
}

@injectable()
export class SentryLogger implements ILogger {
  constructor(dsn: string) {
    init({ dsn });
  }

  setUser(user: TUser | null): void {
    configureScope(scope => {
      scope.setUser(user as any);
    });
  }

  info(...args: LogArg[][]): void {
    addBreadcrumb({
      category: "logger",
      data: { ...args },
      level: Severity.Info,
    });
  }
  verbose(...args: LogArg[][]): void {
    addBreadcrumb({
      category: "logger",
      data: { ...args },
      level: Severity.Log,
    });
  }
  debug(...args: LogArg[][]): void {
    addBreadcrumb({
      category: "logger",
      data: { ...args },
      level: Severity.Debug,
    });
  }
  warn(...args: ErrorArgs[]): void {
    withScope(scope => {
      addBreadcrumb({
        category: "logger",
        data: { ...args.filter(arg => !(arg instanceof Error)) },
        level: Severity.Warning,
      });

      scope.setLevel(Severity.Warning);

      const error = args.find(arg => arg instanceof Error);

      captureException(error);
    });
  }
  error(...args: ErrorArgs[]): void {
    addBreadcrumb({
      category: "logger",
      data: { ...args.filter(arg => !(arg instanceof Error)) },
      level: Severity.Error,
    });

    const error = args.find(arg => arg instanceof Error);

    captureException(error);
  }
}

export const noopLogger: ILogger = {
  setUser: () => {},
  info: () => {},
  verbose: () => {},
  debug: () => {},
  warn: () => {},
  error: () => {},
};
