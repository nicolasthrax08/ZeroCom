// Wraps an API route handler so that thrown errors are mapped to proper
// HTTP responses via handleRouteError. Use in any route that doesn't have
// its own try/catch.
import { handleRouteError } from './http-errors';

export function withErrorHandling<T extends (...args: any[]) => Promise<Response>>(
  handler: T,
): T {
  return (async (...args: any[]) => {
    try {
      return await handler(...args);
    } catch (err) {
      return handleRouteError(err);
    }
  }) as T;
}
