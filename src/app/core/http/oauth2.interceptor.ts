import { Injectable, inject } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, finalize, switchMap, filter, take } from 'rxjs/operators';
import { Router } from '@angular/router';

import { HttpApi } from './http-api';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor funcional JWT para Angular 20+
 * Maneja autenticación JWT con refresh automático de tokens
 */
export const oauth2Interceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log(`[JWTInterceptor] Request: ${req.url}`);

  // Rutas públicas que NO requieren token
  const publicRoutes = [
    '/auth/token/',
    '/auth/register/',
    '/api/healthz/',
    '/api/docs/',
    '/api/schema/',
    '/catalog/products/',
    '/catalog/categories/'
  ];

  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));

  // Agregar Bearer token si NO es ruta pública
  if (!isPublicRoute) {
    const token = authService.getAccessToken();
    
    if (token) {
      console.log(`[JWTInterceptor] Adding Bearer token to: ${req.url}`);
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      console.warn(`[JWTInterceptor] No token found for protected route: ${req.url}`);
    }
  } else {
    console.log(`[JWTInterceptor] Public route, no token needed: ${req.url}`);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error(`[JWTInterceptor] Error ${error.status} on ${req.url}`);
      
      // Manejar 401 Unauthorized - Token expirado o inválido
      if (error.status === 401 && !isPublicRoute) {
        const refreshToken = authService.getRefreshToken();
        
        if (refreshToken) {
          console.log('[JWTInterceptor] Token expirado, intentando refresh...');
          
          // Intentar renovar el token
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Reintentar request con nuevo token
              const newToken = authService.getAccessToken();
              console.log('[JWTInterceptor] Token renovado, reintentando request');
              
              const clonedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              
              return next(clonedReq);
            }),
            catchError(refreshError => {
              console.error('[JWTInterceptor] Error renovando token, cerrando sesión');
              authService.logout();
              router.navigate(['/auth/login'], {
                queryParams: { returnUrl: router.url }
              });
              return throwError(() => refreshError);
            })
          );
        } else {
          // No hay refresh token, logout directo
          console.error('[JWTInterceptor] No refresh token, cerrando sesión');
          authService.logout();
          router.navigate(['/auth/login'], {
            queryParams: { returnUrl: router.url }
          });
        }
      }

      // Manejar otros errores
      if (error.status === 404 && req.url.includes('/api/subscription')) {
        return throwError(() => ({
          ...error,
          message: 'Servicio de suscripción no disponible'
        }));
      }

      return throwError(() => error);
    })
  );
};

/**
 * Interceptor de clase (legacy) - Mantener para compatibilidad
 */
@Injectable()
export class Oauth2Interceptor implements HttpInterceptor {
  refreshTokenInProgress!: boolean;
  refreshTokenSubject: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  private router = inject(Router);

  constructor(
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(`[OAuth2Interceptor] INTERCEPTADO: ${req.url}`);
    
    return next
    .handle(this.performRequest(req))
    .pipe(
      catchError((err) => this.processRequestError(err, req, next))
    );
  }

  private performRequest(req: HttpRequest<any>): HttpRequest<any> {
    if (this.isAuthenticationRequired(req.url)) {
        const token = this.authService.getAccessToken();
        console.log(`[OAuth2Interceptor] URL: ${req.url}, Token presente: ${!!token}`);
        if (token) {
          console.log(`[OAuth2Interceptor] Agregando token: Bearer ${token.substring(0, 20)}...`);
          return req.clone({
            setHeaders: {
              Authorization: `Bearer ${token}`
            }
          });
        } else {
          console.warn(`[OAuth2Interceptor] No se encontró token para: ${req.url}`);
        }
    } else {
      console.log(`[OAuth2Interceptor] Ruta pública, sin token: ${req.url}`);
    }

    return req;
  }

  private processRequestError(error: HttpErrorResponse, req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Si es 401, el token es inválido o expiró
    if (error.status === 401) {
      // Limpiar sesión y redirigir al login
      this.authService.logout();
      
      // Redirigir al login con returnUrl
      const currentUrl = this.router.url;
      this.router.navigate(['/auth/login'], { 
        queryParams: { returnUrl: currentUrl }
      });
      
      return throwError(() => ({
        ...error,
        message: 'Sesión expirada. Por favor, inicia sesión nuevamente.'
      }));
    }

    // Si es 404 en subscription, no mostrar error crítico
    if (error.status === 404 && req.url.includes('/api/subscription')) {
      return throwError(() => ({
        ...error,
        message: 'Servicio de suscripción no disponible'
      }));
    }

    return throwError(() => error);
  }

  // Helpers
  private isAuthenticationRequired(apiUrl: string): boolean {
    const publicRoutes = [
      '/auth/token/',
      '/auth/register/',
      '/api/healthz/',
      '/api/docs/',
      '/api/schema/',
      '/catalog/products/',
      '/catalog/categories/'
    ];
    
    // No agregar token a las rutas públicas
    return !publicRoutes.some(publicUrl => apiUrl.includes(publicUrl));
  }

  // Método para refrescar token (si el backend lo soporta en el futuro)
  private tryAgainWithRefresToken(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (!this.refreshTokenInProgress) {
        this.refreshTokenSubject.next(null);
        this.refreshTokenInProgress = true;

        return this.authService
            .loginWithRefreshToken()
            .pipe(
                switchMap((result) => {
                    if (result) {
                        this.refreshTokenSubject.next(result);
                        return next.handle(this.performRequest(req));
                    }

                    throw new Error('Acceso denegado.');
                }),
                catchError(error => {
                    this.authService.logout();
                    this.router.navigate(['/auth/login']);
                    return throwError(() => error);
                }),
                finalize(() => {
                    this.refreshTokenInProgress = false;
                })
            );
    } else {
        return this.refreshTokenSubject
            .pipe(
                filter(result => result != null),
                take(1),
                switchMap(() => next.handle(this.performRequest(req)))
            );
    }
  }
}
