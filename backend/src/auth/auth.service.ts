import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '../users/user.entity';
import { JwtPayload } from './strategies/jwt.strategy';
import { MailService } from '../mail/mail.service';

const BCRYPT_ROUNDS = 10;
const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const RESET_TOKEN_EXPIRY_MINUTES = 60;

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new ConflictException('El email ya está registrado');
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);
    await this.usersService.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phone: dto.phone,
    });

    return {
      message: 'Usuario registrado. Revisa tu email para confirmar la cuenta.',
    };
  }

  async login(dto: LoginDto, res: Response): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);
    const isValid =
      user && (await bcrypt.compare(dto.password, user.passwordHash));

    if (!isValid) {
      throw new UnauthorizedException(
        'Credenciales incorrectas. Verifica tu email y contraseña.',
      );
    }

    this.issueTokens(user, res);
    return { message: 'Sesión iniciada correctamente.' };
  }

  logout(res: Response): { message: string } {
    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);
    return { message: 'Sesión cerrada.' };
  }

  refreshToken(user: User, res: Response): { message: string } {
    this.issueTokens(user, res);
    return { message: 'Token renovado.' };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByEmail(dto.email);

    // Always return the same message to avoid email enumeration
    const genericMessage =
      'Si el email está registrado, recibirás un enlace de restablecimiento en breve.';

    if (!user) {
      return { message: genericMessage };
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await this.usersService.save(user);

    await this.mailService.sendPasswordResetEmail(user.email, token);

    return { message: genericMessage };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.usersService.findByResetToken(dto.token);

    if (!user || !user.resetPasswordExpires) {
      throw new BadRequestException(
        'El enlace de restablecimiento no es válido. Solicita uno nuevo.',
      );
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new BadRequestException(
        'El enlace de restablecimiento ha expirado. Solicita uno nuevo.',
      );
    }

    user.passwordHash = await bcrypt.hash(dto.newPassword, BCRYPT_ROUNDS);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await this.usersService.save(user);

    return { message: 'Contraseña actualizada correctamente.' };
  }

  private issueTokens(user: User, res: Response): void {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET', 'default_secret'),
      expiresIn: '15m',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>(
        'JWT_REFRESH_SECRET',
        'default_refresh_secret',
      ),
      expiresIn: '7d',
    });

    const cookieOptions = {
      httpOnly: true,
      secure: this.configService.get('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
    };

    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
  }
}
