import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem('token');
      return router.createUrlTree(['/login']);
    }

    if (payload.role === 'VENDEDOR') {
      return router.createUrlTree(['/dashboard']);
    }

  } catch (error) {
    console.error('Token inválido o corrupto', error);
    localStorage.removeItem('token');
    return router.createUrlTree(['/login']);
  }

  return true;
};
