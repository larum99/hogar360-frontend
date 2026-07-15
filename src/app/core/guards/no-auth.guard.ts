import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

export const noAuthGuard: CanActivateFn = () => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (!token) {
    return true;
  }

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      localStorage.removeItem('token');
      return true;
    }

    return router.createUrlTree(['/dashboard']);

  } catch (error) {
    console.error('Token inválido o corrupto', error);
    localStorage.removeItem('token');
    return true;
  }
};
