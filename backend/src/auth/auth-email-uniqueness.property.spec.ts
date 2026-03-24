// Feature: online-plant-nursery, Property 6: Unicidad de email en registro

/**
 * Validates: Requirements 2.2
 *
 * Property 6: Unicidad de email en registro
 * Para cualquier email ya registrado en el sistema, un segundo intento de
 * registro con ese mismo email debe ser rechazado con un error de duplicado.
 */

import * as fc from 'fast-check';
import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/user.entity';
import { MailService } from '../mail/mail.service';

// Use bcrypt with 1 round to keep property tests fast
jest.mock('bcrypt', () => {
  const real = jest.requireActual<typeof import('bcrypt')>('bcrypt');
  return {
    ...real,
    hash: (data: string | Buffer, _saltOrRounds: string | number) =>
      real.hash(data, 1),
  };
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeUser = (email: string, passwordHash: string): User => ({
  id: 'uuid-test',
  email,
  fullName: 'Unique User',
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

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('AuthService — Property 6: Unicidad de email en registro', () => {
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
  // P6: registering the same email twice throws ConflictException (409)
  // -------------------------------------------------------------------------
  it(
    'P6: registrar el mismo email dos veces lanza ConflictException con mensaje de duplicado (Req 2.2)',
    async () => {
      await fc.assert(
        fc.asyncProperty(
          arbEmail,
          arbPassword,
          async (email, password) => {
            let storedUser: User | null = null;

            // First call: no user exists yet; second call: user already stored
            usersService.findByEmail.mockImplementation(async (e: string) => {
              return e === email ? storedUser : null;
            });

            usersService.create.mockImplementation(async (data) => {
              storedUser = makeUser(data.email, data.passwordHash!);
              return storedUser;
            });

            // First registration must succeed
            const firstResult = await service.register({
              fullName: 'Unique User',
              email,
              password,
            });
            expect(firstResult.message).toBeDefined();

            // Second registration with the same email must throw ConflictException
            let thrownError: unknown;
            try {
              await service.register({ fullName: 'Unique User', email, password });
            } catch (err) {
              thrownError = err;
            }

            expect(thrownError).toBeInstanceOf(ConflictException);
            const conflict = thrownError as ConflictException;
            expect(conflict.getStatus()).toBe(409);
            expect(conflict.message).toBe('El email ya está registrado');
          },
        ),
        { numRuns: 100 },
      );
    },
    60_000,
  );
});
