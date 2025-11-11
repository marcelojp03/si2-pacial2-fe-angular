// core/guards/checkout.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Guard para proteger rutas de checkout y pago
 * Permite ver productos sin autenticación, pero requiere login para comprar
 * Si no está autenticado, redirige al login con returnUrl al carrito/checkout
 */
export const checkoutGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Verificar que el usuario esté autenticado
  if (!auth.isAuthenticated()) {
    console.warn('[Checkout Guard] Se requiere autenticación para proceder con la compra');
    
    // Redirigir al login guardando la URL de retorno
    return router.createUrlTree(['/auth/login'], { 
      queryParams: { 
        returnUrl: state.url,
        message: 'Inicia sesión o crea una cuenta para continuar con tu compra'
      } 
    });
  }

  // Verificar que sea un cliente (no admin)
  if (auth.isAdmin()) {
    console.warn('[Checkout Guard] Los administradores no pueden realizar compras');
    return router.createUrlTree(['/admin']);
  }

  console.log('[Checkout Guard] Acceso permitido al checkout');
  return true;
};
