import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { authGuard } from './auth.guard';

describe('authGuard (Jest)', () => {
  let mockRouter: jest.Mocked<Router>;
  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    mockRouter = {
      createUrlTree: jest.fn()
    } as any;

    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
    });

    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should redirect to /login if no token exists', () => {
    const fakeUrlTree = {} as UrlTree;
    mockRouter.createUrlTree.mockReturnValue(fakeUrlTree);

    const result = executeGuard(mockRoute, mockState);

    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(fakeUrlTree);
  });

  it('should redirect to /login if token is expired', () => {
    const expiredToken = generateFakeToken(Math.floor(Date.now() / 1000) - 100);
    localStorage.setItem('token', expiredToken);

    const fakeUrlTree = {} as UrlTree;
    mockRouter.createUrlTree.mockReturnValue(fakeUrlTree);

    const result = executeGuard(mockRoute, mockState);

    expect(localStorage.getItem('token')).toBeNull(); // Token debe ser eliminado
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(fakeUrlTree);
  });

  it('should return true if token is valid', () => {
    const validToken = generateFakeToken(Math.floor(Date.now() / 1000) + 3600);
    localStorage.setItem('token', validToken);

    const result = executeGuard(mockRoute, mockState);

    expect(result).toBe(true);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
  });

  function generateFakeToken(exp: number): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ exp }));
    const signature = 'signature';
    return `${header}.${payload}.${signature}`;
  }
});
