import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

/**
 * Login credentials for the admin dashboard.
 */
export class LoginDto {
  @ApiProperty({ example: 'admin@yogispeaks.local' })
  @IsEmail()
  email!: string;

  @ApiProperty({ minLength: 12 })
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  password!: string;
}

/**
 * Request a password-reset email. Response is always generic.
 */
export class ForgotPasswordDto {
  @ApiProperty({ example: 'admin@yogispeaks.local' })
  @IsEmail()
  email!: string;
}

/**
 * Complete a password reset using the one-time email token.
 */
export class ResetPasswordDto {
  @ApiProperty({ description: 'Raw token from the email link' })
  @IsString()
  @MinLength(32)
  token!: string;

  @ApiProperty({
    description:
      'New password — min 12 chars with upper, lower, and a number',
  })
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must include at least one uppercase letter, one lowercase letter, and one number',
  })
  password!: string;

  @ApiProperty()
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  passwordConfirmation!: string;
}

/**
 * Change password while authenticated.
 */
export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @MinLength(12)
  currentPassword!: string;

  @ApiProperty()
  @IsString()
  @MinLength(12)
  @MaxLength(128)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Password must include at least one uppercase letter, one lowercase letter, and one number',
  })
  newPassword!: string;

  @ApiProperty()
  @IsString()
  @MinLength(12)
  newPasswordConfirmation!: string;
}
