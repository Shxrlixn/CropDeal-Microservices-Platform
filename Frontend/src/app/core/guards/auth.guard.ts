import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserStore } from '../services/user.store';

export const authGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);

  if (userStore.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/auth/login');
};
