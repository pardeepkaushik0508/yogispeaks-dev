/**
 * JWT access-token payload for authenticated admin requests.
 */
export interface JwtAccessPayload {
  sub: string;
  email: string;
  type: 'access';
}

/**
 * JWT refresh-token payload. `sid` is the RefreshSession row id.
 */
export interface JwtRefreshPayload {
  sub: string;
  email: string;
  sid: string;
  type: 'refresh';
}

/**
 * Authenticated admin user attached to the request after JWT validation.
 */
export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  permissions: string[];
  sessionId?: string;
}
