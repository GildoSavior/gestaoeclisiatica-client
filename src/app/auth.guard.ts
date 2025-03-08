import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AccessLevel } from './models/enums/enums';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  
  const userAccessLevel = localStorage.getItem('accessLevel') as AccessLevel | null;
  const url = state.url;

  if (!userAccessLevel) {
    router.navigate(['/auth/login']); // Redireciona se não estiver autenticado
    return false;
  }

  if (url.startsWith('/admin') && userAccessLevel === AccessLevel.ROLE_USER) {
    router.navigate(['/auth/access']); // Bloqueia acesso se não for admin
    return false;
  }

  if (url.startsWith('/client') && userAccessLevel !== AccessLevel.ROLE_USER) {
    router.navigate(['/auth/access']); // Bloqueia acesso se não for admin
    return false;
  }

  return true; // Permite acesso se autorizado
};
