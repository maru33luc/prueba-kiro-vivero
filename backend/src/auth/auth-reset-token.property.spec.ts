// Feature: online-plant-nursery, Property 7: Validez temporal del token de reset

/**
 * Validates: Requirements 2.5, 2.6
 *
 * Property 7: Validez temporal del token de reset de contraseña
 * Para cualquier solicitud de recuperación de contraseña, el token generado
 * debe tener una fecha de expiración igual a la fecha de creación más 60 minutos.
 * Un token con fecha de expiración pasada debe ser rechazado.
 */

import * as fc from 'fast-check';
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { User, UserRole } from '../users/user.entity';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const SIXTY_MINUTES_MS = 60 * 60 * 1000;

const makeUser = (overrides: Partial<User> = {}): User => ({
  id: 'uuid-test',
  email: 'user@example.com',
  passwordHash: 'hash',
  role: UserRole.USER,
  emailVerified: false,
  resetPasswordToken: null,
  resetPasswordExpires: null,
  createdAt: new Date(),
  ...overrides,
});

/** Arbitrary: a Date within a reasonable range (year 2000–2100) */
const arbDate = fc.date({
  min: new Date('2000-01-01T00:00:00.000Z'),
  max: new Date('2100-01-01T00:00:00.000Z'),
});

/** Arbitrary: a positive offset in ms (1ms to 24h) representing how far in the
 *  past the expiry is — i.e. the token is expired */
const arbExpiredOffsetMs = fc.integer({ min: 1, max: 24 * 60 * 60 * 1000 });

/** Arbitrary: a positive offset in ms (1ms to 59min) representing how much
 *  time is still left before expiry — i.e. the token is still valid */
const arbValidRemainingMs = fc.integer({ min: 1, max: SIXTY_MINUTES_MS - 1 });

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('AuthService — Property 7: Validez temporal del token de reset', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let mailService: jest.Mocked<MailService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findByResetToken: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn().mockReturnValue('mock-token') },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((_key: string, def?: string) => def ?? ''),
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
    mailService = module.get(MailService);
  });

  afterEach(() => jest.clearAllMocks());

  // -------------------------------------------------------------------------
  // P7-A: forgotPassword generates a token with expiry = createdAt + 60 min
  // -------------------------------------------------------------------------
  it(
    'P7-A: forgotPassword genera un token con expiración = now + 60 minutos (Req 2.5)',
    async () => {
      await fc.assert(
        fc.asyncProperty(arbDate, async (baseDate) => {
          // Control "now" by using fake timers
          jest.useFakeTimers();
          jest.setSystemTime(baseDate);

          let capturedExpires: Date | null = null;

          usersService.findByEmail.mockResolvedValue(makeUser({ email: 'user@example.com' }));
          usersService.save.mockImplementation(async (user: User) => {
            capturedExpires = user.resetPasswordExpires;
            return user;
          });

          await service.forgotPassword({ email: 'user@example.com' });

          jest.useRealTimers();

          expect(capturedExpires).not.toBeNull();

          const expectedExpiry = new Date(baseDate.getTime() + SIXTY_MINUTES_MS);
          // Allow ±1 second tolerance for execution time
          const diff = Math.abs(capturedExpires!.getTime() - expectedExpiry.getTime());
          expect(diff).toBeLessThanOrEqual(1000);
        }),
        { numRuns: 100 },
      );
    },
    60_000,
  );

  // -------------------------------------------------------------------------
  // P7-B: resetPassword with an expired token throws BadRequestException
  // -------------------------------------------------------------------------
  it(
    'P7-B: resetPassword con token expirado lanza BadRequestException (Req 2.6)',
    async () => {
      await fc.assert(
        fc.asyncProperty(arbDate, arbExpiredOffsetMs, async (now, expiredOffsetMs) => {
          jest.useFakeTimers();
          jest.setSystemTime(now);

          // Token expired: expiry is in the past relative to `now`
          const expiredDate = new Date(now.getTime() - expiredOffsetMs);

          usersService.findByResetToken.mockResolvedValue(
            makeUser({
              resetPasswordToken: 'expired-token',
              resetPasswordExpires: expiredDate,
            }),
          );

          let threw = false;
          try {
            await service.resetPassword({ token: 'expired-token', newPassword: 'newPass123' });
          } catch (err) {
            if (err instanceof BadRequestException) {
              threw = true;
            } else {
              jest.useRealTimers();
              throw err;
            }
          }

          jest.useRealTimers();
          expect(threw).toBe(true);
        }),
        { numRuns: 100 },
      );
    },
    60_000,
  );

  // -------------------------------------------------------------------------
  // P7-C: resetPassword with a valid (non-expired) token succeeds
  // -------------------------------------------------------------------------
  it(
    'P7-C: resetPassword con token válido (no expirado) tiene éxito (Req 2.5)',
    async () => {
      await fc.assert(
        fc.asyncProperty(arbDate, arbValidRemainingMs, async (now, remainingMs) => {
          jest.useFakeTimers();
          jest.setSystemTime(now);

          // Token still valid: expiry is in the future relative to `now`
          const validExpiry = new Date(now.getTime() + remainingMs);

          usersService.findByResetToken.mockResolvedValue(
            makeUser({
              resetPasswordToken: 'valid-token',
              resetPasswordExpires: validExpiry,
            }),
          );
          usersService.save.mockResolvedValue(makeUser());

          let result: { message: string } | undefined;
          try {
            result = await service.resetPassword({ token: 'valid-token', newPassword: 'newPass123' });
          } finally {
            jest.useRealTimers();
          }

          expect(result).toBeDefined();
          expect(result!.message).toBeDefined();
        }),
        { numRuns: 100 },
      );
    },
    60_000,
  );
});
