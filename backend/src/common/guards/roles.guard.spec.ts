import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { UserRole } from '../constants/roles.enum';

describe('RolesGuard (Authorization Tests)', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  function createMockContext(user: any): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
      getHandler: () => ({}),
      getClass: () => ({}),
    } as any;
  }

  it('should allow access if no roles are required on route', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
    const context = createMockContext({ role: UserRole.CANDIDATE });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow CANDIDATE user accessing CANDIDATE route', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([UserRole.CANDIDATE]);
    const context = createMockContext({ role: UserRole.CANDIDATE });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should reject CANDIDATE user accessing RECRUITER or COMPANY_ADMIN route with ForbiddenException', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.RECRUITER, UserRole.COMPANY_ADMIN]);
    const context = createMockContext({ role: UserRole.CANDIDATE });
    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should allow COMPANY_ADMIN accessing employer management route', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.COMPANY_ADMIN]);
    const context = createMockContext({ role: UserRole.COMPANY_ADMIN });
    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow SUPER_ADMIN to access any restricted route', () => {
    jest
      .spyOn(reflector, 'getAllAndOverride')
      .mockReturnValue([UserRole.RECRUITER]);
    const context = createMockContext({ role: UserRole.SUPER_ADMIN });
    expect(guard.canActivate(context)).toBe(true);
  });
});
