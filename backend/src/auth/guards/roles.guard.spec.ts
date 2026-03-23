import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../../users/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

function buildContext(user: unknown, handler = {}, cls = {}): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => cls,
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('allows access when no roles metadata is set', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const ctx = buildContext({ role: UserRole.USER });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('allows access when roles array is empty', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
    const ctx = buildContext({ role: UserRole.USER });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('allows access when user has the required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
    const ctx = buildContext({ role: UserRole.ADMIN });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('denies access when user does not have the required role', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
    const ctx = buildContext({ role: UserRole.USER });
    expect(guard.canActivate(ctx)).toBe(false);
  });

  it('denies access when user is undefined', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.ADMIN]);
    const ctx = buildContext(undefined);
    expect(guard.canActivate(ctx)).toBe(false);
  });

  it('uses ROLES_KEY to retrieve metadata', () => {
    const spy = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.USER]);
    const handler = {};
    const cls = {};
    const ctx = buildContext({ role: UserRole.USER }, handler, cls);
    guard.canActivate(ctx);
    expect(spy).toHaveBeenCalledWith(ROLES_KEY, [handler, cls]);
  });
});
