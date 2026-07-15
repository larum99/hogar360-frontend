import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { roleGuard } from './role.guard';

describe('roleGuard (Jest)', () => {
  let routerMock: { createUrlTree: jest.Mock };
  const route = {} as ActivatedRouteSnapshot;
  const state = {} as RouterStateSnapshot;

  const executeGuard = () =>
    TestBed.runInInjectionContext(() => roleGuard(route, state));

  beforeEach(() => {
    routerMock = {
      createUrlTree: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerMock }],
    });

    localStorage.clear();
    jest.clearAllMocks();
  });

  it('debe redirigir a /login si no hay token', () => {
    const mockTree = {} as UrlTree;
    routerMock.createUrlTree.mockReturnValue(mockTree);

    const result = executeGuard();
    expect(result).toBe(mockTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('debe redirigir a /login si el token está expirado', () => {
    const expiredPayload = btoa(
      JSON.stringify({ exp: Math.floor(Date.now() / 1000) - 60, role: 'ADMIN' })
    );
    const expiredToken = `header.${expiredPayload}.signature`;
    localStorage.setItem('token', expiredToken);

    const mockTree = {} as UrlTree;
    routerMock.createUrlTree.mockReturnValue(mockTree);

    const result = executeGuard();
    expect(result).toBe(mockTree);
    expect(localStorage.getItem('token')).toBeNull();
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);
  });

  it('debe redirigir a /dashboard si el rol es VENDEDOR', () => {
    const validPayload = btoa(
      JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 60, role: 'VENDEDOR' })
    );
    const validToken = `header.${validPayload}.signature`;
    localStorage.setItem('token', validToken);

    const mockTree = {} as UrlTree;
    routerMock.createUrlTree.mockReturnValue(mockTree);

    const result = executeGuard();
    expect(result).toBe(mockTree);
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
  });

  it('debe permitir acceso si el rol no es VENDEDOR y el token es válido', () => {
    const validPayload = btoa(
      JSON.stringify({ exp: Math.floor(Date.now() / 1000) + 60, role: 'ADMIN' })
    );
    const validToken = `header.${validPayload}.signature`;
    localStorage.setItem('token', validToken);

    const result = executeGuard();
    expect(result).toBe(true);
  });

  it('debe redirigir a /login si el token es inválido o corrupto', () => {
    localStorage.setItem('token', 'token.corrupto');

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const mockTree = {} as UrlTree;
    routerMock.createUrlTree.mockReturnValue(mockTree);

    const result = executeGuard();
    expect(result).toBe(mockTree);
    expect(localStorage.getItem('token')).toBeNull();
    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(routerMock.createUrlTree).toHaveBeenCalledWith(['/login']);

    consoleErrorSpy.mockRestore();
  });
});
