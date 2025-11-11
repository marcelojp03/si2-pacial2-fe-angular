# 🔐 Autenticación de Clientes - E-Commerce

## ✅ Separación de Autenticación

Este proyecto utiliza **DOS sistemas de autenticación SEPARADOS**:

### 1. 👨‍💼 Admin (Django Admin Panel)
- **URL**: `http://127.0.0.1:8000/admin/`
- **Usuario**: `marcelojp03` / `Admin123!`
- **Autenticación**: Django Session (cookies)
- **Restricción**: NO puede ser cliente, NO puede usar API de clientes

### 2. 👤 Clientes (API REST con JWT)
- **Base URL**: `http://127.0.0.1:8000/api/customers/`
- **Usuario de Prueba**: `trevorcalero` / `Cliente123!`
- **Autenticación**: JWT Bearer Token
- **Restricción**: NO puede ser staff, NO puede acceder a /admin/

---

## 📡 Endpoints Implementados en Angular

### 1. Registro (`POST /api/customers/register/`)
```typescript
// AuthService
register(request: RegisterRequest): Observable<User>

// RegisterRequest (campos obligatorios)
{
  username: string,
  email: string,
  password: string,
  password2: string,        // ⚠️ Confirmación (REQUERIDO)
  first_name?: string,
  last_name?: string,
  phone?: string,
  city?: string,
  country?: string
}
```

### 2. Login (`POST /api/customers/login/`)
```typescript
// AuthService
login(username: string, password: string): Observable<LoginResponse>

// Respuesta del backend
{
  user: {
    id: number,
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    ...
  },
  tokens: {
    access: string,        // Válido 1 hora
    refresh: string       // Válido 7 días
  },
  message: "Login successful"
}
```

### 3. Ver Perfil (`GET /api/customers/profile/`)
```typescript
// AuthService (requiere JWT token)
loadCurrentUser(): Observable<User>
```

### 4. Refresh Token (`POST /api/customers/token/refresh/`)
```typescript
// AuthService
refreshToken(): Observable<RefreshTokenResponse>

// Request
{ refresh: string }

// Response (con rotación)
{
  access: string,    // Nuevo access token
  refresh: string   // Nuevo refresh token
}
```

### 5. Logout (`POST /api/customers/logout/`)
```typescript
// AuthService
logout(): void

// Blacklist del refresh token
{ refresh: string }
```

---

## 🔧 Archivos Actualizados

### 1. `src/app/core/services/auth.service.ts`
```typescript
// ✅ Endpoints actualizados a /api/customers/
login()          → POST /api/customers/login/
register()       → POST /api/customers/register/
loadCurrentUser()→ GET /api/customers/profile/
refreshToken()   → POST /api/customers/token/refresh/
logout()         → POST /api/customers/logout/
```

### 2. `src/app/core/models/auth.model.ts`
```typescript
// ✅ RegisterRequest actualizado
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  password2: string;      // ⬅️ NUEVO (requerido por backend)
  first_name?: string;
  last_name?: string;
  phone?: string;         // ⬅️ NUEVO (campos de cliente)
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
}

// ✅ LoginResponse actualizado
interface LoginResponse {
  access: string;
  refresh: string;
  user?: User;           // ⬅️ NUEVO (datos del usuario en login)
}
```

### 3. `src/app/auth/register/register.component.ts`
```typescript
// ✅ Incluye password2 en el request
const registerRequest: RegisterRequest = {
  username: this.form.value.email,
  email: this.form.value.email,
  password: this.form.value.password,
  password2: this.form.value.passwordConfirmation,  // ⬅️ NUEVO
  first_name: this.form.value.fullName?.split(' ')[0] || '',
  last_name: this.form.value.fullName?.split(' ').slice(1).join(' ') || ''
};
```

---

## 🔑 Flujo de Autenticación

```
┌──────────────────┐
│  Usuario Cliente │
└────────┬─────────┘
         │
         │ 1. Registro o Login
         ▼
┌─────────────────────────┐
│  LoginComponent         │
│  - Valida formulario    │
│  - authService.login()  │
└────────┬────────────────┘
         │
         │ 2. POST /api/customers/login/
         ▼
┌─────────────────────────────────┐
│  Backend Django                 │
│  - Valida credenciales          │
│  - Genera JWT (access + refresh)│
│  - Retorna user + tokens        │
└────────┬────────────────────────┘
         │
         │ 3. { user, tokens, message }
         ▼
┌─────────────────────────────────┐
│  AuthService                    │
│  - Guarda tokens en localStorage│
│  - Actualiza currentUser$       │
│  - Guarda user en localStorage  │
└────────┬────────────────────────┘
         │
         │ 4. Navegación a /admin o /shopping
         ▼
┌─────────────────────────────────┐
│  OAuth2Interceptor              │
│  - Intercepta cada request      │
│  - Agrega Authorization: Bearer │
│  - Renueva token si expira      │
└─────────────────────────────────┘
```

---

## 💾 Almacenamiento Local

### localStorage Keys:
```typescript
'access_token'   // JWT access token
'refresh_token'  // JWT refresh token  
'user'          // JSON stringificado con datos del usuario
```

### Datos del Usuario:
```json
{
  "id": 2,
  "username": "trevorcalero",
  "email": "trevorfelixcalerosuyo@gmail.com",
  "first_name": "Trevor",
  "last_name": "Calero",
  "phone": "77788899",
  "is_active": true,
  "date_joined": "2025-11-11T...",
  "last_login": "2025-11-11T..."
}
```

---

## ⚠️ Validaciones Backend

### Restricciones de Usuario
- ❌ Usuario `is_staff=True` NO puede tener perfil de cliente
- ❌ Usuario `is_superuser=True` NO puede tener perfil de cliente
- ❌ No se puede registrar con username/email de usuario staff

### Requisitos de Password
- ✅ Mínimo 8 caracteres
- ✅ Al menos 1 mayúscula
- ✅ Al menos 1 minúscula
- ✅ Al menos 1 número
- ✅ Al menos 1 carácter especial (!@#$%^&*)

### Token JWT
- ⏱️ Access Token: válido 1 hora
- ⏱️ Refresh Token: válido 7 días
- 🔄 Rotación habilitada (cada refresh genera nuevo token)
- 🚫 Blacklist habilitada (logout invalida el token)

---

## 🧪 Testing desde Frontend

### 1. Test de Registro
```typescript
// Desde navegador (console)
const registerData = {
  username: 'testuser',
  email: 'test@example.com',
  password: 'Test123!@',
  password2: 'Test123!@',
  first_name: 'Test',
  last_name: 'User',
  phone: '75512345',
  city: 'Santa Cruz'
};

// El componente de registro maneja esto automáticamente
```

### 2. Test de Login
```typescript
// LoginComponent lo maneja automáticamente
// Username: trevorcalero
// Password: Cliente123!
```

### 3. Verificar Token Guardado
```typescript
// En console del navegador
console.log(localStorage.getItem('access_token'));
console.log(localStorage.getItem('refresh_token'));
console.log(JSON.parse(localStorage.getItem('user')));
```

---

## 🔒 Guards Implementados

### AuthGuard (`auth.guard.ts`)
```typescript
// Protege rutas que requieren autenticación
{
  path: 'admin',
  canActivate: [AuthGuard],
  loadChildren: () => import('./admin/admin.routes')
}
```

### LoggedGuard (`logged.guard.ts`)
```typescript
// Previene acceso a login/register si ya está autenticado
{
  path: 'auth/login',
  canActivate: [LoggedGuard],
  component: LoginComponent
}
```

---

## 🔄 Renovación Automática de Tokens

### OAuth2Interceptor
```typescript
// 1. Verifica si el token está expirado antes de cada request
// 2. Si expira en menos de 5 minutos, renueva automáticamente
// 3. Si el refresh falla, hace logout automático
// 4. Agrega header Authorization: Bearer <token> a cada request
```

### Flujo de Renovación
```
Request → Interceptor → ¿Token expirado?
                         │
                         ├─ No → Agregar header → Enviar request
                         │
                         └─ Sí → refreshToken()
                                  │
                                  ├─ Éxito → Guardar nuevo token → Reintentar request
                                  │
                                  └─ Error → logout() → Redirect a /auth/login
```

---

## 📝 Endpoints de Backend (Referencia)

| Método | Endpoint | Autenticación | Descripción |
|--------|----------|---------------|-------------|
| POST | `/api/customers/register/` | No | Crear cuenta de cliente |
| POST | `/api/customers/login/` | No | Login con username/password |
| GET | `/api/customers/profile/` | JWT | Ver perfil actual |
| PUT/PATCH | `/api/customers/profile/` | JWT | Actualizar perfil |
| PUT | `/api/customers/change-password/` | JWT | Cambiar contraseña |
| POST | `/api/customers/token/refresh/` | No | Renovar access token |
| POST | `/api/customers/logout/` | JWT | Logout (blacklist token) |

---

## 🎯 Usuarios de Prueba

### Cliente
```
Username: trevorcalero
Password: Cliente123!
Email: trevorfelixcalerosuyo@gmail.com
```

### Admin (Django Admin Panel)
```
Username: marcelojp03
Password: Admin123!
Email: marcelojp03@gmail.com
URL: http://127.0.0.1:8000/admin/
```

**⚠️ IMPORTANTE**: Estos usuarios están completamente separados y no pueden cruzar sistemas.

---

## ✅ Estado de Implementación

- ✅ AuthService actualizado con endpoints de clientes
- ✅ Modelos actualizados (RegisterRequest con password2)
- ✅ LoginComponent funcionando con respuesta correcta
- ✅ RegisterComponent enviando password2
- ✅ OAuth2Interceptor agregando JWT Bearer token
- ✅ Renovación automática de tokens
- ✅ Logout con blacklist de tokens
- ✅ Guards protegiendo rutas correctamente
- ✅ Zero errores de compilación

---

**Última Actualización**: 11 de Noviembre, 2025  
**Estado**: ✅ Completamente Implementado y Probado
