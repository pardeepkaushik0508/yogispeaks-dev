import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { hashToken } from '../utils/token.util';
import type {
  AuthUser,
  JwtRefreshPayload,
} from '../interfaces/jwt-payload.interface';

/**
 * Validates refresh JWTs from the HttpOnly `refresh_token` cookie.
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          (req?.cookies as Record<string, string> | undefined)?.refresh_token ??
          null,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.refreshSecret'),
      passReqToCallback: true,
    });
  }

  /**
   * Ensures the refresh session still exists, is not revoked, and matches the cookie hash.
   */
  async validate(
    req: Request,
    payload: JwtRefreshPayload,
  ): Promise<AuthUser | null> {
    if (payload.type !== 'refresh' || !payload.sid) {
      return null;
    }

    const raw =
      (req.cookies as Record<string, string> | undefined)?.refresh_token ?? '';
    const tokenHash = hashToken(raw);

    const session = await this.prisma.refreshSession.findFirst({
      where: {
        id: payload.sid,
        adminUserId: payload.sub,
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: {
        adminUser: {
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: { include: { permission: true } },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!session || session.adminUser.status !== 'ACTIVE' || session.adminUser.deletedAt) {
      return null;
    }

    const user = session.adminUser;
    const roles = user.roles.map((r) => r.role.code);
    const permissions = [
      ...new Set(
        user.roles.flatMap((r) =>
          r.role.permissions.map((p) => p.permission.code),
        ),
      ),
    ];

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles,
      permissions,
      sessionId: session.id,
    };
  }
}
