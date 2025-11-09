// ========================================
// SECURITY MODELS
// ========================================

export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  role?: Role;
  is_active: boolean;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  message: string;
  access_token?: string;
  refresh_token?: string;
}

export interface ChangePasswordRequest {
  old_password: string;
  new_password: string;
}

export interface Permission {
  id: number;
  resource: string;
  can_view: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
  permissions?: Permission[];
}

export interface Resource {
  id: number;
  name: string;
  description: string;
  path: string;
  icon?: string;
  subresources?: SubResource[];
}

export interface SubResource {
  id: number;
  name: string;
  path: string;
  http_method: string;
}

export interface RoleResource {
  id: number;
  role: number;
  resource: number;
  can_view: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
}

export interface MenuItem {
  label: string;
  icon?: string;
  routerLink?: string;
  items?: MenuItem[];
}
