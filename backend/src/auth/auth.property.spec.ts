// Feature: online-plant-nursery, Property 5: Round-trip de autenticación

/**
 * Validates: Requirements 2.1, 2.3, 2.4
 *
 * Property 5: Round-trip de autenticación
 * Para cualquier par email/contraseña válido, registrar un usuario y luego
 * iniciar sesión con esas credenciales debe devolver una sesión activa.
 * Intentar iniciar sesión con credenciales incorrectas debe devolver siempre
 * el mismo mensaje de error genérico, independientemente de qué campo sea incorrecto.
 */

import * as fc from 'fast-check';
import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/user.entity';
import { MailService } from '../mail/mail.service';
import { Response } from 'express';

// Use real bcrypt but with 1 round to keep property tests fast
// eslint-disable-next-line @typescript-eslint/no-var-requires
const realBcrypt = require('bcrypt') as typeof import('bcrypt');

jest.mock('bcrypt', () => {
  const real = jest.requireActual<typeof import('bcrypt')>('bcrypt');
  return {
    ...real,
    // Override hash to use 1 round instead of 10
    hash: (data: string | Buffer, _saltOrRounds: string | number) =>
      real.hash(data, 1),
  };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockRes = (): Response => {
  const res: Partial<Response> = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
  };
  return res as Response;
};

const makeUser = (email: string, passwordHash: string): User => ({
  id: 'uuid-test',
  email,
  fullName: 'Roundtrip User',
  phone: null as unknown as string,
  passwordHash,
  role: UserRole.USER,
  emailVerified: false,
  createdAt: new Date(),
  resetPasswordToken: null,
  resetPasswordExpires: null,
});

/** Arbitrary: valid email */
const arbEmail = fc
  .tuple(
    fc.stringMatching(/^[a-z]{3,10}$/),
    fc.stringMatching(/^[a-z]{3,10}$/),
    fc.constantFrom('com', 'net', 'org', 'io'),
  )
  .map(([local, domain, tld]) => `${local}@${domain}.${tld}`);

/** Arbitrary: valid password (8–20 printable ASCII chars) */
const arbPassword = fc
  .string({ minLength: 8, maxLength: 20 })
  .filter((s) => /^[\x20-\x7E]+$/.test(s));

/** Arbitrary: valid credentials pair */
const arbCredentials = fc.record({ email: arbEmail, password: arbPassword });

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('AuthService — Property 5: Round-trip de autenticación', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
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
          useValue: { sendPasswordResetEmail: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
  });

  afterEach(() => jest.clearAllMocks());

  // -------------------------------------------------------------------------
  // P5-A: register then login with same credentials → active session
  // -------------------------------------------------------------------------
  it(
    'P5-A: register(email, password) then login(email, password) succeeds (Req 2.1, 2.3)',
    async () => {
      await fc.assert(
        fc.asyncProperty(arbCredentials, async ({ email, password }) => {
          let storedHash = '';

          usersService.findByEmail.mockImplementation(async (e: string) => {
            if (e === email && storedHash) {
              return makeUser(email, storedHash);
            }
            return null;
          });

          usersService.create.mockImplementation(async (data) => {
            storedHash = data.passwordHash!;
            return makeUser(data.email, storedHash);
          });

          // Register
          const registerResult = await service.register({
            fullName: 'Roundtrip User',
            email,
            password,
          });
          expect(registerResult.message).toBeDefined();

          // Login with same credentials
          const res = mockRes();
          const loginResult = await service.login({ email, password }, res);

          // Session is active: success message + both cookies set
          expect(loginResult.message).toBeDefined();
          expect(res.cookie).toHaveBeenCalledTimes(2);
        }),
        { numRuns: 100 },
      );
    },
    60_000,
  );

  // -------------------------------------------------------------------------
  // P5-B: login with wrong password → same generic error message
  // -------------------------------------------------------------------------
  it(
    'P5-B: login with wrong password always returns the same generic error (Req 2.4)',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          arbCredentials,
          arbPassword,
          async ({ email, password }, wrongPassword) => {
            fc.pre(wrongPassword !== password);

            const hash = realBcrypt.hashSync(password, 1);
            usersService.findByEmail.mockResolvedValue(makeUser(email, hash));

            const res = mockRes();
            let errorMessage: string | undefined;
            try {
              await service.login({ email, password: wrongPassword }, res);
            } catch (err) {
              if (err instanceof UnauthorizedException) {
                errorMessage = err.message;
              } else {
                throw err;
              }
            }

            expect(errorMessage).toBeDefined();
            expect(errorMessage).toBe(
              'Credenciales incorrectas. Verifica tu email y contraseña.',
            );
            expect(res.cookie).not.toHaveBeenCalled();
          },
        ),
        { numRuns: 100 },
      );
    },
    60_000,
  );

  // -------------------------------------------------------------------------
  // P5-C: login with wrong email → same generic error message
  // -------------------------------------------------------------------------
  it(
    'P5-C: login with wrong email always returns the same generic error (Req 2.4)',
    async () => {
      await fc.assert(
        fc.asyncProperty(arbCredentials, arbEmail, async ({ email, password }, wrongEmail) => {
          fc.pre(wrongEmail !== email);

          // No user found for the wrong email
          usersService.findByEmail.mockResolvedValue(null);

          const res = mockRes();
          let errorMessage: string | undefined;
          try {
            await service.login({ email: wrongEmail, password }, res);
          } catch (err) {
            if (err instanceof UnauthorizedException) {
              errorMessage = err.message;
            } else {
              throw err;
            }
          }

          expect(errorMessage).toBeDefined();
          expect(errorMessage).toBe(
            'Credenciales incorrectas. Verifica tu email y contraseña.',
          );
          expect(res.cookie).not.toHaveBeenCalled();
        }),
        { numRuns: 100 },
      );
    },
    30_000,
  );

  // -------------------------------------------------------------------------
  // P5-D: error message is identical regardless of which field is wrong
  // -------------------------------------------------------------------------
  it(
    'P5-D: error message is the same whether email or password is wrong (Req 2.4)',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          arbCredentials,
          arbEmail,
          arbPassword,
          async ({ email, password }, wrongEmail, wrongPassword) => {
            fc.pre(wrongEmail !== email && wrongPassword !== password);

            const hash = realBcrypt.hashSync(password, 1);
            const existingUser = makeUser(email, hash);

            // Case 1: wrong password (user found, password mismatch)
            usersService.findByEmail.mockResolvedValue(existingUser);
            const res1 = mockRes();
            let msgWrongPassword: string | undefined;
            try {
              await service.login({ email, password: wrongPassword }, res1);
            } catch (err) {
              if (err instanceof UnauthorizedException) msgWrongPassword = err.message;
            }

            // Case 2: wrong email (user not found)
            usersService.findByEmail.mockResolvedValue(null);
            const res2 = mockRes();
            let msgWrongEmail: string | undefined;
            try {
              await service.login({ email: wrongEmail, password }, res2);
            } catch (err) {
              if (err instanceof UnauthorizedException) msgWrongEmail = err.message;
            }

            // Both errors must carry the exact same message
            expect(msgWrongPassword).toBeDefined();
            expect(msgWrongEmail).toBeDefined();
            expect(msgWrongPassword).toBe(msgWrongEmail);
          },
        ),
        { numRuns: 100 },
      );
    },
    60_000,
  );
});
