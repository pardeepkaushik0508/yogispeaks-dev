import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import type { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import type {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  ResetPasswordDto,
} from './dto/auth.dto';
import type { AuthUser } from './interfaces/jwt-payload.interface';
import {
  createSecureToken,
  hashToken,
  parseDurationToMs,
} from './utils/token.util';

const REFRESH_COOKIE = 'refresh_token';
const MAX_FAILED_LOGINS = 5;
const LOCK_MINUTES = 15;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

/**
 * Handles admin authentication, session rotation, and password reset flows.
 *
 * Google OAuth is intentionally not enabled yet — keep this module ready for a
 * future passport-google strategy once client credentials exist.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Verifies credentials, issues tokens, and records audit events.
   * Always returns a generic error on failure to avoid account enumeration.
   */
  async login(dto: LoginDto, req: Request, res: Response) {
    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.adminUser.findFirst({
      where: { email, deletedAt: null },
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

    const invalidMessage = 'Invalid email or password';

    if (!user || user.status !== 'ACTIVE') {
      await this.audit(null, 'auth.login_failed', 'AdminUser', null, {
        email,
        reason: 'not_found_or_inactive',
      }, req);
      throw new UnauthorizedException(invalidMessage);
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      await this.audit(user.id, 'auth.login_locked', 'AdminUser', user.id, {}, req);
      throw new UnauthorizedException(
        'Account temporarily locked. Try again later.',
      );
    }

    const valid = await argon2.verify(user.passwordHash, dto.password);
    if (!valid) {
      const failedLoginCount = user.failedLoginCount + 1;
      const lockedUntil =
        failedLoginCount >= MAX_FAILED_LOGINS
          ? new Date(Date.now() + LOCK_MINUTES * 60_000)
          : null;

      await this.prisma.adminUser.update({
        where: { id: user.id },
        data: {
          failedLoginCount,
          lockedUntil,
        },
      });

      await this.audit(user.id, 'auth.login_failed', 'AdminUser', user.id, {
        failedLoginCount,
      }, req);
      throw new UnauthorizedException(invalidMessage);
    }

    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: {
        failedLoginCount: 0,
        lockedUntil: null,
        lastLoginAt: new Date(),
      },
    });

    const tokens = await this.issueSession(user.id, user.email, req, res);
    await this.audit(user.id, 'auth.login_success', 'AdminUser', user.id, {}, req);

    const roles = user.roles.map((r) => r.role.code);
    const permissions = [
      ...new Set(
        user.roles.flatMap((r) =>
          r.role.permissions.map((p) => p.permission.code),
        ),
      ),
    ];

    return {
      accessToken: tokens.accessToken,
      expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles,
        permissions,
      },
    };
  }

  /**
   * Rotates the refresh token: revokes the old session and issues a new pair.
   */
  async refresh(user: AuthUser, req: Request, res: Response) {
    if (!user.sessionId) {
      throw new UnauthorizedException('Invalid or expired session');
    }

    await this.prisma.refreshSession.update({
      where: { id: user.sessionId },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.issueSession(user.id, user.email, req, res, user.sessionId);
    return {
      accessToken: tokens.accessToken,
      expiresIn: this.configService.get<string>('jwt.accessExpiresIn'),
    };
  }

  /**
   * Revokes the current refresh session and clears the cookie.
   */
  async logout(user: AuthUser, res: Response) {
    if (user.sessionId) {
      await this.prisma.refreshSession.updateMany({
        where: { id: user.sessionId, revokedAt: null },
        data: { revokedAt: new Date() },
      });
    }
    this.clearRefreshCookie(res);
    return { loggedOut: true };
  }

  /**
   * Revokes every refresh session for the admin (logout from all devices).
   */
  async logoutAll(user: AuthUser, res: Response) {
    await this.prisma.refreshSession.updateMany({
      where: { adminUserId: user.id, revokedAt: null },
      data: { revokedAt: new Date() },
    });
    this.clearRefreshCookie(res);
    await this.audit(user.id, 'auth.logout_all', 'AdminUser', user.id, {});
    return { loggedOut: true };
  }

  /**
   * Starts the forgot-password flow.
   * Always returns the same message whether or not the email exists.
   */
  async forgotPassword(dto: ForgotPasswordDto, req: Request) {
    const generic = {
      message:
        'If an account exists for that email, password reset instructions have been sent.',
    };

    const email = dto.email.trim().toLowerCase();
    const user = await this.prisma.adminUser.findFirst({
      where: { email, deletedAt: null, status: 'ACTIVE' },
    });

    if (!user) {
      return generic;
    }

    const rawToken = createSecureToken(32);
    const tokenHash = hashToken(rawToken);

    await this.prisma.passwordResetToken.create({
      data: {
        adminUserId: user.id,
        tokenHash,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const frontendUrl = this.configService.get<string>('frontend.url');
    const resetUrl = `${frontendUrl}/admin/reset-password?token=${rawToken}`;

    await this.mailService.sendMail({
      to: user.email,
      subject: 'Reset your YogiSpeaks admin password',
      html: `<p>Hello ${user.fullName},</p>
<p>We received a request to reset your admin password.</p>
<p><a href="${resetUrl}">Reset password</a></p>
<p>This link expires in 1 hour. If you did not request this, you can ignore this email.</p>`,
    });

    await this.audit(user.id, 'auth.forgot_password', 'AdminUser', user.id, {}, req);
    return generic;
  }

  /**
   * Completes password reset with a one-time token and revokes all sessions.
   */
  async resetPassword(dto: ResetPasswordDto, req: Request) {
    if (dto.password !== dto.passwordConfirmation) {
      throw new BadRequestException('Password confirmation does not match');
    }

    const tokenHash = hashToken(dto.token);
    const record = await this.prisma.passwordResetToken.findFirst({
      where: {
        tokenHash,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const passwordHash = await argon2.hash(dto.password);

    await this.prisma.$transaction([
      this.prisma.adminUser.update({
        where: { id: record.adminUserId },
        data: {
          passwordHash,
          failedLoginCount: 0,
          lockedUntil: null,
        },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
      this.prisma.refreshSession.updateMany({
        where: { adminUserId: record.adminUserId, revokedAt: null },
        data: { revokedAt: new Date() },
      }),
    ]);

    await this.audit(
      record.adminUserId,
      'auth.reset_password',
      'AdminUser',
      record.adminUserId,
      {},
      req,
    );

    return { reset: true };
  }

  /**
   * Changes the password for the currently authenticated admin.
   */
  async changePassword(user: AuthUser, dto: ChangePasswordDto, req: Request) {
    if (dto.newPassword !== dto.newPasswordConfirmation) {
      throw new BadRequestException('Password confirmation does not match');
    }

    const admin = await this.prisma.adminUser.findUniqueOrThrow({
      where: { id: user.id },
    });

    const valid = await argon2.verify(admin.passwordHash, dto.currentPassword);
    if (!valid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    const passwordHash = await argon2.hash(dto.newPassword);
    await this.prisma.adminUser.update({
      where: { id: user.id },
      data: { passwordHash },
    });

    await this.prisma.refreshSession.updateMany({
      where: {
        adminUserId: user.id,
        revokedAt: null,
        ...(user.sessionId ? { NOT: { id: user.sessionId } } : {}),
      },
      data: { revokedAt: new Date() },
    });

    await this.audit(user.id, 'auth.change_password', 'AdminUser', user.id, {}, req);
    return { changed: true };
  }

  /**
   * Returns the authenticated admin profile with roles and permissions.
   */
  me(user: AuthUser) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: user.roles,
      permissions: user.permissions,
    };
  }

  private async issueSession(
    userId: string,
    email: string,
    req: Request,
    res: Response,
    replacedSessionId?: string,
  ) {
    const accessExpiresIn =
      this.configService.get<string>('jwt.accessExpiresIn') ?? '15m';
    const refreshExpiresIn =
      this.configService.get<string>('jwt.refreshExpiresIn') ?? '7d';

    const session = await this.prisma.refreshSession.create({
      data: {
        adminUserId: userId,
        tokenHash: 'pending',
        expiresAt: new Date(Date.now() + parseDurationToMs(refreshExpiresIn)),
        userAgent: req.headers['user-agent']?.slice(0, 512),
        ip: req.ip,
      },
    });

    const accessToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        type: 'access',
      },
      {
        secret: this.configService.getOrThrow<string>('jwt.accessSecret'),
        expiresIn: accessExpiresIn as `${number}m` | `${number}d` | `${number}h` | `${number}s`,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
        sid: session.id,
        type: 'refresh',
      },
      {
        secret: this.configService.getOrThrow<string>('jwt.refreshSecret'),
        expiresIn: refreshExpiresIn as `${number}m` | `${number}d` | `${number}h` | `${number}s`,
      },
    );

    await this.prisma.refreshSession.update({
      where: { id: session.id },
      data: { tokenHash: hashToken(refreshToken) },
    });

    if (replacedSessionId) {
      await this.prisma.refreshSession.update({
        where: { id: replacedSessionId },
        data: { replacedById: session.id, revokedAt: new Date() },
      });
    }

    this.setRefreshCookie(res, refreshToken, parseDurationToMs(refreshExpiresIn));
    return { accessToken, sessionId: session.id };
  }

  private refreshCookieOptions() {
    // Cross-site admin (frontend.onrender.com → api.onrender.com) needs
    // SameSite=None; Secure. Lax cookies are dropped by the browser on XHR.
    const secure = this.configService.get<boolean>('cookie.secure') ?? false;
    return {
      httpOnly: true,
      secure,
      sameSite: (secure ? 'none' : 'lax') as 'none' | 'lax',
      path: '/',
    };
  }

  private setRefreshCookie(res: Response, token: string, maxAgeMs: number) {
    res.cookie(REFRESH_COOKIE, token, {
      ...this.refreshCookieOptions(),
      maxAge: maxAgeMs,
    });
  }

  private clearRefreshCookie(res: Response) {
    res.clearCookie(REFRESH_COOKIE, this.refreshCookieOptions());
  }

  private async audit(
    actorId: string | null,
    action: string,
    entityType: string,
    entityId: string | null,
    metadata: Record<string, unknown> = {},
    req?: Request,
  ) {
    await this.prisma.auditLog.create({
      data: {
        actorId: actorId ?? undefined,
        action,
        entityType,
        entityId: entityId ?? undefined,
        metadata: metadata as object,
        ip: req?.ip,
        userAgent: req?.headers['user-agent']?.slice(0, 512),
      },
    });
  }
}
