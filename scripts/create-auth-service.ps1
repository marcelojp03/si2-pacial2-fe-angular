$authServiceContent = @"
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  TokenVerifyRequest,
  RegisterRequest,
  User
} from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.api.baseUrl;
  
  private currentUserSubject = new BehaviorSubject<User | null>(this.getUserFromStorage());
  public currentUser`$ = this.currentUserSubject.asObservable();

  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'user';

  constructor() {
    this.checkTokenOnInit();
  }

  private checkTokenOnInit(): void {
    const token = this.getAccessToken();
    if (token && this.isTokenExpired(token)) {
      console.warn('[AuthService] Token expirado al iniciar');
      this.refreshToken().subscribe({
        error: () => this.logout()
      });
    }
  }

  login(username: string, password: string): Observable<LoginResponse> {
    const credentials: LoginRequest = { username, password };
    
    return this.http.post<LoginResponse>(`$`{this.apiUrl}/auth/token/`, credentials)
      .pipe(
        tap(response => {
          this.saveTokens(response.access, response.refresh);
          this.loadCurrentUser().subscribe();
        }),
        catchError(error => {
          console.error('[AuthService] Error en login:', error);
          return throwError(() => error);
        })
      );
  }

  register(request: RegisterRequest): Observable<User> {
    return this.http.post<User>(`$`{this.apiUrl}/auth/register/`, request)
      .pipe(
        catchError(error => {
          console.error('[AuthService] Error en registro:', error);
          return throwError(() => error);
        })
      );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    const request: RefreshTokenRequest = { refresh: refreshToken };
    
    return this.http.post<RefreshTokenResponse>(`$`{this.apiUrl}/auth/token/refresh/`, request)
      .pipe(
        tap(response => {
          this.saveTokens(response.access, response.refresh);
        }),
        catchError(error => {
          console.error('[AuthService] Error renovando token:', error);
          this.logout();
          return throwError(() => error);
        })
      );
  }

  verifyToken(token: string): Observable<boolean> {
    const request: TokenVerifyRequest = { token };
    
    return this.http.post(`$`{this.apiUrl}/auth/token/verify/`, request)
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  loadCurrentUser(): Observable<User> {
    return this.http.get<User>(`$`{this.apiUrl}/auth/me/`)
      .pipe(
        tap(user => {
          this.saveUser(user);
          this.currentUserSubject.next(user);
        }),
        catchError(error => {
          console.error('[AuthService] Error obteniendo usuario:', error);
          return throwError(() => error);
        })
      );
  }

  logout(): void {
    this.http.post(`$`{this.apiUrl}/auth/logout/`, {})
      .pipe(catchError(() => of(null)))
      .subscribe();

    this.clearStorage();
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  private saveTokens(access: string, refresh: string): void {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, access);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refresh);
  }

  private saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  private getUserFromStorage(): User | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }

  private clearStorage(): void {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !!token && !this.isTokenExpired(token);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = this.getTokenPayload(token);
      if (!payload || !payload.exp) {
        return true;
      }
      
      const expDate = payload.exp * 1000;
      return Date.now() >= expDate;
    } catch {
      return true;
    }
  }

  private getTokenPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('[AuthService] Error decodificando token:', error);
      return null;
    }
  }

  // M\u00e9todos legacy para compatibilidad
  get accessToken(): string | null {
    return this.getAccessToken();
  }

  isLogged(): boolean {
    return this.isAuthenticated();
  }

  getAuthToken(): string | null {
    return this.getAccessToken();
  }

  loginWithRefreshToken(): Observable<any> {
    return this.refreshToken();
  }

  clearExpiredSession(): void {
    this.clearStorage();
  }
}
"@

# Escribir el archivo
$authServiceContent | Out-File -FilePath "src\app\core\services\auth.service.ts" -Encoding UTF8

Write-Host "AuthService creado exitosamente"
