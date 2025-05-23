import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = localStorage.getItem('token');
  if (!token) {
    return router.createUrlTree(['/login']);
  }

  const payload = JSON.parse(atob(token.split('.')[1]));
  const currentTime = Math.floor(Date.now() / 1000);

  if (payload.exp && payload.exp < currentTime) {
    localStorage.removeItem('token');
    return router.createUrlTree(['/login']);
  }

  return true;
};
