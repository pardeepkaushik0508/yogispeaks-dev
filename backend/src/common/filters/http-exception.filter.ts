import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import type { ApiErrorResponse } from '../dto/api-response.dto';

/**
 * Global HTTP exception filter.
 * Returns a consistent JSON envelope and never exposes stack traces in production.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const requestId = request.requestId ?? 'unknown';

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: unknown;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const payload = exceptionResponse as Record<string, unknown>;

        if (Array.isArray(payload.message)) {
          errors = payload.message;
          message = 'Validation failed';
        } else if (typeof payload.message === 'string') {
          message = payload.message;
        }

        if (payload.errors !== undefined) {
          errors = payload.errors;
        }
      }
    } else if (exception instanceof Error) {
      this.logger.error(
        `[${requestId}] ${exception.message}`,
        process.env.NODE_ENV === 'production' ? undefined : exception.stack,
      );
    }

    const body: ApiErrorResponse = {
      success: false,
      message,
      ...(errors !== undefined ? { errors } : {}),
      meta: { requestId },
    };

    response.status(status).json(body);
  }
}
