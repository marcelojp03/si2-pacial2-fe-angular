# 🛒 E-Commerce Angular Frontend

**Proyecto:** Sistema de E-Commerce con Panel de Administración  
**Framework:** Angular 20 (Standalone Components)  
**UI:** PrimeNG + Tailwind CSS  
**Backend:** Django REST Framework  
**Estado Reactivo:** Angular Signals

---

## 📋 Descripción

Sistema de comercio electrónico completo con:
- ✅ **Catálogo de productos** con filtros avanzados
- ✅ **Carrito de compras** reactivo con Signals
- ✅ **Gestión de inventario** en múltiples almacenes
- ✅ **Dashboard con analytics** y predicción de ventas (ML)
- ✅ **Reportes con IA** usando lenguaje natural
- ✅ **Panel de administración** completo (CRUD)
- ✅ **Sistema de roles y permisos** (RBAC)

---

## 🚀 Quick Start

### 1. Instalar dependencias

```bash
npm install
```

### 2. Instalar dependencias adicionales (Chart.js)

```bash
npm install ng2-charts chart.js uuid
npm install -D @types/uuid
```

### 3. Configurar backend

Asegúrate de que el backend Django esté corriendo en:
```
http://127.0.0.1:8000
```

Ver documentación del backend en:
- `docs/API_DOCUMENTATION.md`
- `docs/API_QUICK_REFERENCE.md`

### 4. Ejecutar el proyecto

```bash
ng serve
```

Navegar a `http://localhost:4200`

---

## 📁 Estructura del Proyecto

```
src/app/
├── core/
│   ├── models/              # Interfaces TypeScript (Catalog, Sales, Inventory, Analytics)
│   ├── services/            # ApiService centralizado (todos los endpoints)
│   ├── state/               # CartStore con Signals
│   ├── guards/              # Auth guards
│   ├── http/                # Interceptors (OAuth2, JWT)
│   └── layouts/             # App layout (sidebar, topbar)
│
├── dashboard/               # Panel de administración
│   ├── components/
│   │   ├── home/           # Dashboard principal con métricas
│   │   ├── product/        # Gestión de productos
│   │   ├── warehouses/     # Gestión de almacenes
│   │   ├── inventory/      # Control de inventario
│   │   ├── cart/           # Carrito de compras
│   │   ├── ai-reports/     # Reportes con IA
│   │   └── ...
│   └── dashboard.routes.ts
│
├── auth/                    # Login y registro
├── landing/                 # Landing page público
└── environments/            # Configuración (dev/prod)
```

---

## 🎯 Features Implementados

### ✅ Core (100%)
- [x] Modelos TypeScript completos
- [x] ApiService con todos los endpoints
- [x] CartStore con Signals
- [x] Auth guards y interceptors
- [x] Configuración de entorno

### 🚧 UI (40%)
- [x] Landing page
- [x] Login/Register
- [x] Dashboard layout
- [ ] Catálogo de productos (pendiente)
- [ ] Carrito de compras (pendiente)
- [ ] Checkout (pendiente)
- [ ] Dashboard con gráficos (pendiente)
- [ ] Reportes con prompts (pendiente)

### 📊 Admin (30%)
- [x] Productos (adaptado de MRP)
- [x] Almacenes
- [x] Inventario
- [ ] Clientes
- [ ] Órdenes
- [ ] Categorías

---

## 🛠️ Tecnologías

- **Angular:** 20.1.5 (standalone components)
- **PrimeNG:** 20.0.1 (UI components)
- **Tailwind CSS:** 3.4.17 (utilidades)
- **Chart.js:** Para gráficos (ng2-charts)
- **RxJS:** 7.8.0 (manejo de estado)
- **TypeScript:** 5.8.3

---

## 📚 Documentación

### Para Desarrolladores
- **QUICKSTART.md** - Inicio rápido y comandos útiles
- **IMPLEMENTATION_GUIDE.md** - Guía completa de implementación de componentes
- **ECOMMERCE_STATUS.md** - Estado actual del proyecto

### API
- **docs/API_DOCUMENTATION.md** - Documentación completa de la API
- **docs/API_QUICK_REFERENCE.md** - Referencia rápida de endpoints

---

## 🔧 Configuración

### Backend URL

En `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  api: {
    baseUrl: 'http://127.0.0.1:8000/api',
    timeout: 30000,
  },
  mock: false,
};
```

---

## 🧪 Testing

```bash
# Unit tests
ng test

# Build
ng build --configuration production
```

---

## 🐛 Troubleshooting

### CORS Error
Asegúrate de que Django tenga CORS configurado:
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
]
```

### Chart.js no funciona
```bash
npm install ng2-charts chart.js
```

---

## 📞 API Endpoints Principales

### Catálogo
- `GET /api/catalog/products/` - Lista de productos
- `GET /api/catalog/categories/` - Lista de categorías

### Ventas
- `POST /api/sales/carts/{id}/add_item/` - Agregar al carrito
- `POST /api/sales/carts/{id}/checkout/` - Crear orden

### Analytics
- `GET /api/analytics/sales/dashboard/` - Dashboard de ventas
- `POST /api/analytics/sales/generate_report/` - Generar reporte

**Ver documentación completa en `docs/`**

---

## 🎯 Próximos Pasos

1. [ ] Crear ProductsListComponent
2. [ ] Crear CartPageComponent
3. [ ] Actualizar Dashboard con gráficos
4. [ ] Implementar reportes con prompts
5. [ ] Agregar soporte de voz (Web Speech API)

Ver **IMPLEMENTATION_GUIDE.md** para código completo.

---

**¿Necesitas ayuda?** Revisa los archivos de documentación en la raíz del proyecto.

🚀 **¡Happy Coding!**
