import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import type { Request } from 'express';
import type { ApiSuccessResponse } from '../dto/api-response.dto';

/**
 * Wraps successful controller responses in the standard YogiSpeaks API envelope.
 */
@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccessResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const requestId = request.requestId ?? 'unknown';

    return next.handle().pipe(
      map((data) => ({
        success: true as const,
        message: 'Success',
        data,
        meta: { requestId },
      })),
    );
  }
}
