// Feature: online-plant-nursery, Property 18: Control de acceso basado en roles

/**
 * Validates: Requirements 8.1, 8.2
 *
 * Property 18: Control de acceso basado en roles
 * Para cualquier request no autenticado a endpoints protegidos (carrito, checkout,
 * historial de pedidos), el sistema debe responder con HTTP 401.
 * Para cualquier request autenticado sin rol `admin` a endpoints de administración,
 * el sistema debe responder con HTTP 403.
 */

import * as fc from 'fast-check';
import { ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { UserRole } from '../users/user.entity';
import { ROLES_KEY } from './decorators/roles.decorator';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a mock ExecutionContext with an optional user attached to the request */
function buildContext(
  user: { role: UserRole } | null | undefined,
  requiredRoles: UserRole[],
): ExecutionContext {
  const handler = {};
  const cls = {};
  return {
    getHandler: () => handler,
    getClass: () => cls,
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

/** Build a Reflector that returns the given roles for any key */
function buildReflector(requiredRoles: UserRole[]): Reflector {
  const reflector = new Reflector();
  jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
  return reflector;
}

// ---------------------------------------------------------------------------
// Arbitraries
// ---------------------------------------------------------------------------

/** Any non-admin role (currently only USER, but future-proof via filter) */
const arbNonAdminRole = fc.constantFrom(UserRole.USER);

/** Any valid UserRole */
const arbAnyRole = fc.constantFrom(UserRole.USER, UserRole.ADMIN);

/** Protected user-facing routes (require authentication, any role) */
const arbProtectedUserRoute = fc.constantFrom(
  '/cart',
  '/cart/items',
  '/orders/me',
  '/checkout',
);

/** Admin-only routes */
const arbAdminRoute = fc.constantFrom(
  '/admin/plants',
  '/admin/categories',
  '/admin/orders',
  '/orders',
);

// ---------------------------------------------------------------------------
// Test suite
// ---------------------------------------------------------------------------

describe('Guards — Property 18: Control de acceso basado en roles', () => {
  afterEach(() => jest.clearAllMocks());

  // -------------------------------------------------------------------------
  // P18-A: RolesGuard returns false (403) for any non-admin user on admin routes
  // -------------------------------------------------------------------------
  it(
    'P18-A: RolesGuard denies non-admin users access to admin routes (Req 8.2)',
    () => {
      fc.assert(
        fc.property(arbNonAdminRole, arbAdminRoute, (role, _route) => {
          const requiredRoles = [UserRole.ADMIN];
          const reflector = buildReflector(requiredRoles);
          const guard = new RolesGuard(reflector);
          const ctx = buildContext({ role }, requiredRoles);

          const result = guard.canActivate(ctx);

          // Non-admin must be denied
          expect(result).toBe(false);
        }),
        { numRuns: 100 },
      );
    },
  );

  // -------------------------------------------------------------------------
  // P18-B: RolesGuard returns true for admin users accessing admin routes
  // -------------------------------------------------------------------------
  it(
    'P18-B: RolesGuard allows admin users access to admin routes (Req 8.2)',
    () => {
      fc.assert(
        fc.property(arbAdminRoute, (_route) => {
          const requiredRoles = [UserRole.ADMIN];
          const reflector = buildReflector(requiredRoles);
          const guard = new RolesGuard(reflector);
          const ctx = buildContext({ role: UserRole.ADMIN }, requiredRoles);

          const result = guard.canActivate(ctx);

          // Admin must be allowed
          expect(result).toBe(true);
        }),
        { numRuns: 100 },
      );
    },
  );

  // -------------------------------------------------------------------------
  // P18-C: RolesGuard returns false when user is absent (unauthenticated)
  //        Unauthenticated requests to protected endpoints → 401 / denied
  // -------------------------------------------------------------------------
  it(
    'P18-C: RolesGuard denies access when no user is present (unauthenticated, Req 8.1)',
    () => {
      fc.assert(
        fc.property(arbProtectedUserRoute, (_route) => {
          const requiredRoles = [UserRole.ADMIN];
          const reflector = buildReflector(requiredRoles);
          const guard = new RolesGuard(reflector);

          // No user on the request (unauthenticated)
          const ctx = buildContext(undefined, requiredRoles);

          const result = guard.canActivate(ctx);

          // Must be denied — JwtAuthGuard would throw 401 before this,
          // but RolesGuard must also return false when user is absent
          expect(result).toBe(false);
        }),
        { numRuns: 100 },
      );
    },
  );

  // -------------------------------------------------------------------------
  // P18-D: RolesGuard allows any authenticated user on non-role-restricted routes
  // -------------------------------------------------------------------------
  it(
    'P18-D: RolesGuard allows any authenticated user when no roles are required (Req 8.1)',
    () => {
      fc.assert(
        fc.property(arbAnyRole, arbProtectedUserRoute, (role, _route) => {
          // No required roles metadata → open to any authenticated user
          const reflector = buildReflector([]);
          const guard = new RolesGuard(reflector);
          const ctx = buildContext({ role }, []);

          const result = guard.canActivate(ctx);

          // No role restriction → access granted
          expect(result).toBe(true);
        }),
        { numRuns: 100 },
      );
    },
  );

  // -------------------------------------------------------------------------
  // P18-E: JwtAuthGuard throws UnauthorizedException for unauthenticated requests
  //        Simulated by verifying the guard's handleRequest method behaviour
  // -------------------------------------------------------------------------
  it(
    'P18-E: JwtAuthGuard.handleRequest throws UnauthorizedException when no user (Req 8.1)',
    () => {
      fc.assert(
        fc.property(arbProtectedUserRoute, (_route) => {
          // JwtAuthGuard extends AuthGuard('jwt') which calls handleRequest.
          // When Passport fails to authenticate, handleRequest receives err/false.
          // We test the inherited handleRequest logic directly.
          const { JwtAuthGuard } = require('./guards/jwt-auth.guard');
          const guard = new JwtAuthGuard();

          // Simulate Passport calling handleRequest with no user (authentication failed)
          expect(() => {
            guard.handleRequest(null, false, null);
          }).toThrow(UnauthorizedException);
        }),
        { numRuns: 100 },
      );
    },
  );
});
