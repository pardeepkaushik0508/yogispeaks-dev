import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Shared meta block included on every API response. */
export class ApiResponseMetaDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  requestId!: string;
}

/**
 * Standard success envelope returned by {@link TransformInterceptor}.
 * @template T Payload type returned by the controller.
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
  meta: { requestId: string };
}

/**
 * Standard error envelope returned by {@link HttpExceptionFilter}.
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: unknown;
  meta: { requestId: string };
}

/** Swagger schema for generic success responses. */
export class ApiSuccessResponseDto {
  @ApiProperty({ example: true })
  success!: true;

  @ApiProperty({ example: 'Success' })
  message!: string;

  @ApiProperty({ description: 'Controller payload' })
  data!: unknown;

  @ApiProperty({ type: ApiResponseMetaDto })
  meta!: ApiResponseMetaDto;
}

/** Swagger schema for error responses. */
export class ApiErrorResponseDto {
  @ApiProperty({ example: false })
  success!: false;

  @ApiProperty({ example: 'Validation failed' })
  message!: string;

  @ApiPropertyOptional({
    description: 'Validation or domain-specific error details',
  })
  errors?: unknown;

  @ApiProperty({ type: ApiResponseMetaDto })
  meta!: ApiResponseMetaDto;
}
