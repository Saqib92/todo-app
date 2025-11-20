import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // If not logged in → redirect to login
  if (!auth.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Allow route access
  return true;
};
