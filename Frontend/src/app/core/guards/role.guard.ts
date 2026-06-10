import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserStore } from '../services/user.store';

export const roleGuard: CanActivateFn = (route, state) => {
  const userStore = inject(UserStore);
  const router = inject(Router);
  const expectedRoles = route.data['roles'] as Array<string>;
  const currentRole = userStore.role();

  if (!userStore.isAuthenticated()) {
    return router.parseUrl('/auth/login');
  }

  if (currentRole && expectedRoles.includes(currentRole)) {
    return true;
  }

  // Not authorized, redirect to their specific dashboard or login
  return router.parseUrl('/auth/login'); // Or a generic unauthorized page
};
