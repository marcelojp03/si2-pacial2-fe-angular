/**
 * Modelos de Autenticación JWT
 * Backend API v2.0
 */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;  // JWT access token (válido 1 hora)
  refresh: string; // JWT refresh token (válido 7 días)
  user?: User;     // Datos del usuario (desde /api/customers/login/)
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh: string; // Nuevo refresh token (rotación habilitada)
}

export interface TokenVerifyRequest {
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;      // Confirmación de contraseña (requerido por backend)
  first_name?: string;
  last_name?: string;
  phone?: string;         // Campos adicionales para clientes
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar: string;
  is_active: boolean;
  date_joined: string;
  last_login: string | null;
  role_name: string | null;
}

export interface MenuItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  order: number;
  parent: MenuItem | null;
  children: MenuItem[];
}

export interface TokenPayload {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
}
