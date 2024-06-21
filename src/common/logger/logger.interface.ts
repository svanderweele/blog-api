export interface ILogger {
  trace(message: unknown, params?: any): void;
  info(message: unknown, params?: any): void;
  warn(message: unknown, params?: any): void;
  error(message: unknown, error: unknown, params?: any): void;
  fatal(message: unknown, error: unknown, params?: any): void;
  setContext(context: Record<string, any>): void;
}
