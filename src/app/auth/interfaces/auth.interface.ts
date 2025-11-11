export class User {
    correo_electronico?: string;
    clave?: string;
}

export class User2 {
    login?: string;
    password?: string;
}

// New interfaces for updated API
export interface LoginRequest {
    email: string;
    password: string;
}

export interface UserData {
    email: string;
    id: number;
    name: string;
    photo: string | null;
    roles: UserRole[];
    status: boolean;
}

export interface UserRole {
    role: string;
    role_id: number;
    user_id: number;
}

export interface LoginSuccessResponse {
    user_type: 'customer' | 'admin';  // Indica el tipo de usuario
    user: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        is_staff: boolean;
        is_superuser: boolean;
        username?: string;  // Solo para admin
    };
    tokens?: {  // Solo para clientes
        access: string;
        refresh: string;
    };
    customer?: {  // Solo para clientes
        id: number;
        phone?: string;
        city?: string;
    };
    message: string;
}

export interface LoginErrorResponse {
    code: string;
    data: null;
    message: string;
    success: boolean;
}

export interface MenuResource {
    description: string;
    id: number;
    name: string;
    subresources: MenuSubresource[];
}

export interface MenuSubresource {
    description: string;
    icon: string;
    id: number;
    name: string;
    url: string;
}

export interface MenuResponse {
    data: MenuResource[];
    message: string;
    success: boolean;
}