declare global {
  namespace Express {
    interface Request {
      /** Correlation id set by {@link RequestIdMiddleware}. */
      requestId: string;
    }
  }
}

export {};
