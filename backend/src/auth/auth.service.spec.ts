import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { User, UserRole } from '../users/user.entity';
import { Response } from 'express';

const mockUser: User = {
  id: 'uuid-1',
  email: 'test@example.com',
  passwordHash: '',
  role: UserRole.USER,
  emailVerified: false,
  resetPasswordToken: null,
  resetPasswordExpires: null,
  createdAt: new Date(),
};

const mockRes = () => {
  const res: Partial<Response> = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };
  return res as Response;
};

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let mailService: jest.Mocked<MailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findByResetToken: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock-token') },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string, def?: string) => def ?? ''),
          },
        },
        {
          provide: MailService,
          useValue: { sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined) },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    mailService = module.get(MailService);
  });

  describe('register', () => {
    it('should create a user and return success message', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockResolvedValue({ ...mockUser });

      const result = await service.register({
        email: 'new@example.com',
        password: 'password123',
      });

      expect(usersService.create).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'new@example.com' }),
      );
      expect(result.message).toBeDefined();
    });

    it('should throw ConflictException when email already exists', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(
        service.register({ email: 'test@example.com', password: 'password123' }),
      ).rejects.toThrow(ConflictException);
    });

    it('should store a bcrypt hash, not the plain password', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.create.mockImplementation(async (data) => ({
        ...mockUser,
        ...data,
      }));

      const password = 'mySecret123';
      await service.register({ email: 'new@example.com', password });

      const callArg = usersService.create.mock.calls[0][0];
      expect(callArg.passwordHash).not.toBe(password);
      const isHash = await bcrypt.compare(password, callArg.passwordHash!);
      expect(isHash).toBe(true);
    });
  });

  describe('login', () => {
    it('should set cookies and return success message for valid credentials', async () => {
      const hash = await bcrypt.hash('password123', 10);
      usersService.findByEmail.mockResolvedValue({ ...mockUser, passwordHash: hash });

      const res = mockRes();
      const result = await service.login(
        { email: 'test@example.com', password: 'password123' },
        res,
      );

      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(result.message).toBeDefined();
    });

    it('should throw UnauthorizedException for wrong password', async () => {
      const hash = await bcrypt.hash('correct', 10);
      usersService.findByEmail.mockResolvedValue({ ...mockUser, passwordHash: hash });

      const res = mockRes();
      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }, res),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for unknown email', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const res = mockRes();
      await expect(
        service.login({ email: 'nobody@example.com', password: 'pass' }, res),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should clear both cookies', () => {
      const res = mockRes();
      service.logout(res);
      expect(res.clearCookie).toHaveBeenCalledWith('access_token');
      expect(res.clearCookie).toHaveBeenCalledWith('refresh_token');
    });
  });

  describe('refreshToken', () => {
    it('should issue new tokens and return success message', () => {
      const res = mockRes();
      const result = service.refreshToken(mockUser, res);
      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(result.message).toBeDefined();
    });
  });

  describe('forgotPassword', () => {
    it('should return generic message and send email when user exists', async () => {
      usersService.findByEmail.mockResolvedValue({ ...mockUser });
      usersService.save.mockResolvedValue({ ...mockUser });

      const result = await service.forgotPassword({ email: 'test@example.com' });

      expect(usersService.save).toHaveBeenCalled();
      expect(mailService.sendPasswordResetEmail).toHaveBeenCalledWith(
        'test@example.com',
        expect.any(String),
      );
      expect(result.message).toBeDefined();
    });

    it('should return generic message without sending email when user does not exist', async () => {
      usersService.findByEmail.mockResolvedValue(null);

      const result = await service.forgotPassword({ email: 'nobody@example.com' });

      expect(usersService.save).not.toHaveBeenCalled();
      expect(mailService.sendPasswordResetEmail).not.toHaveBeenCalled();
      expect(result.message).toBeDefined();
    });
  });

  describe('resetPassword', () => {
    it('should update password and clear token when token is valid', async () => {
      const futureDate = new Date(Date.now() + 60 * 60 * 1000);
      const userWithToken: User = {
        ...mockUser,
        resetPasswordToken: 'valid-token',
        resetPasswordExpires: futureDate,
      };
      usersService.findByResetToken.mockResolvedValue(userWithToken);
      usersService.save.mockResolvedValue({ ...userWithToken });

      const result = await service.resetPassword({
        token: 'valid-token',
        newPassword: 'newPassword123',
      });

      const savedUser = usersService.save.mock.calls[0][0];
      expect(savedUser.resetPasswordToken).toBeNull();
      expect(savedUser.resetPasswordExpires).toBeNull();
      const isHash = await bcrypt.compare('newPassword123', savedUser.passwordHash);
      expect(isHash).toBe(true);
      expect(result.message).toBeDefined();
    });

    it('should throw BadRequestException when token is not found', async () => {
      usersService.findByResetToken.mockResolvedValue(null);

      await expect(
        service.resetPassword({ token: 'bad-token', newPassword: 'newPassword123' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException when token is expired', async () => {
      const pastDate = new Date(Date.now() - 1000);
      const userWithExpiredToken: User = {
        ...mockUser,
        resetPasswordToken: 'expired-token',
        resetPasswordExpires: pastDate,
      };
      usersService.findByResetToken.mockResolvedValue(userWithExpiredToken);

      await expect(
        service.resetPassword({ token: 'expired-token', newPassword: 'newPassword123' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
