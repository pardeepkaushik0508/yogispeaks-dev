import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  AuthUser,
  JwtAccessPayload,
} from '../interfaces/jwt-payload.interface';

/**
 * Validates short-lived access JWTs from the Authorization Bearer header.
 */
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor(
    configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.accessSecret'),
    });
  }

  /**
   * Loads the admin user and expands roles/permissions onto the request user.
   */
  async validate(payload: JwtAccessPayload): Promise<AuthUser | null> {
    if (payload.type !== 'access') {
      return null;
    }

    const user = await this.prisma.adminUser.findFirst({
      where: { id: payload.sub, deletedAt: null, status: 'ACTIVE' },
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
    });

    if (!user) {
      return null;
    }

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
    };
  }
}
