import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const registroGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return new Promise((resolve) => {
    authService.auth.onAuthStateChanged((auth) => {
      if(!auth || auth.displayName == 'Administrador') {
        resolve(true);
      }
      else {
        if (!authService.generatingUser) {
          router.navigateByUrl('', {replaceUrl: true});
        }
      }
    })
  })
};
