// Feature: online-plant-nursery, Property 19: Contraseñas almacenadas como hash bcrypt

/**
 * Validates: Requirements 8.3
 *
 * Property 19: Contraseñas almacenadas como hash bcrypt
 * Para cualquier usuario registrado, el campo `passwordHash` almacenado nunca
 * debe ser igual al texto plano de la contraseña, y debe ser un hash bcrypt
 * válido (verificable con `bcrypt.compare`).
 */

import * as fc from 'fast-check';
import * as bcrypt from 'bcrypt';
import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/user.entity';
import { MailService } from '../mail/mail.service';

// Use real bcrypt with 1 round for speed while still validating real hash behaviour
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
  passwordHash,
  role: UserRole.USER,
  emailVerified: false,
  createdAt: new Date(),
  resetPasswordToken: null,
  resetPasswordExpires: null,
});

/** Arbitrary: valid password (8–20 printable ASCII chars) */
const arbPassword = fc
  .string({ minLength: 8, maxLength: 20 })
  .filter((s) => /^[\x20-\x7E]+$/.test(s));

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('AuthService — Property 19: Contraseñas almacenadas como hash bcrypt', () => {
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
  // P19: stored passwordHash is never equal to the plaintext password,
  //      and bcrypt.compare(plaintext, storedHash) returns true
  // -------------------------------------------------------------------------
  it(
    'P19: passwordHash almacenado nunca es igual al texto plano y es un hash bcrypt válido (Req 8.3)',
    async () => {
      await fc.assert(
        fc.asyncProperty(arbPassword, async (password) => {
          const email = `user_${Math.random().toString(36).slice(2)}@test.com`;
          let capturedHash: string | undefined;

          usersService.findByEmail.mockResolvedValue(null);
          usersService.create.mockImplementation(async (data) => {
            capturedHash = data.passwordHash;
            return makeUser(data.email, data.passwordHash!);
          });

          await service.register({ email, password });

          // The hash must have been captured
          expect(capturedHash).toBeDefined();
          const storedHash = capturedHash!;

          // 1. The stored hash must NOT equal the plaintext password
          expect(storedHash).not.toBe(password);

          // 2. The stored hash must be a valid bcrypt hash (bcrypt.compare returns true)
          const isValid = await bcrypt.compare(password, storedHash);
          expect(isValid).toBe(true);
        }),
        { numRuns: 100 },
      );
    },
    60_000,
  );
});
