# 🛒 E-commerce Angular Frontend# 🛒 E-Commerce Angular Frontend



Sistema de comercio electrónico con panel de administración desarrollado con Angular 20.1.5 y PrimeNG 20.**Proyecto:** Sistema de E-Commerce con Panel de Administración  

**Framework:** Angular 20 (Standalone Components)  

[![Angular](https://img.shields.io/badge/Angular-20.1.5-red)](https://angular.io/)**UI:** PrimeNG + Tailwind CSS  

[![PrimeNG](https://img.shields.io/badge/PrimeNG-20.0.1-blue)](https://primeng.org/)**Backend:** Django REST Framework  

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)**Estado Reactivo:** Angular Signals

[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4)](https://tailwindcss.com/)

---

---

## 📋 Descripción

## 📋 Tabla de Contenidos

Sistema de comercio electrónico completo con:

- [Características](#-características)- ✅ **Catálogo de productos** con filtros avanzados

- [Arquitectura](#-arquitectura)- ✅ **Carrito de compras** reactivo con Signals

- [Requisitos](#-requisitos)- ✅ **Gestión de inventario** en múltiples almacenes

- [Instalación](#-instalación)- ✅ **Dashboard con analytics** y predicción de ventas (ML)

- [Comandos Disponibles](#-comandos-disponibles)- ✅ **Reportes con IA** usando lenguaje natural

- [Estructura del Proyecto](#-estructura-del-proyecto)- ✅ **Panel de administración** completo (CRUD)

- [Rutas de la Aplicación](#-rutas-de-la-aplicación)- ✅ **Sistema de roles y permisos** (RBAC)

- [Documentación](#-documentación)

- [Tecnologías](#-tecnologías)---



---## 🚀 Quick Start



## ✨ Características### 1. Instalar dependencias



### 🛍️ **Shopping (E-commerce Público)**```bash

- Catálogo de productos con búsqueda y filtrosnpm install

- Carrito de compras con persistencia```

- Proceso de checkout completo

- Gestión de pedidos del cliente### 2. Instalar dependencias adicionales (Chart.js)

- Pasarela de pagos integrada

```bash

### 🔐 **Admin (Panel de Administración)**npm install ng2-charts chart.js uuid

- Dashboard con métricas y análisisnpm install -D @types/uuid

- Gestión completa de productos y categorías```

- Administración de pedidos y clientes

- Control de inventario y almacenes### 3. Configurar backend

- Gestión de proveedores

- Sistema de usuarios y rolesAsegúrate de que el backend Django esté corriendo en:

- Reportes y exportación de datos```

http://127.0.0.1:8000

### 🔑 **Autenticación**```

- Login y registro de usuarios

- JWT token managementVer documentación del backend en:

- Guards para rutas protegidas- `docs/API_DOCUMENTATION.md`

- OAuth2 interceptor- `docs/API_QUICK_REFERENCE.md`



---### 4. Ejecutar el proyecto



## 🏗️ Arquitectura```bash

ng serve

El proyecto sigue una arquitectura modular con dos áreas principales:```



```Navegar a `http://localhost:4200`

src/app/

├── admin/          # Panel de administración (protegido)---

│   └── components/ # Módulos de gestión

├── shopping/       # E-commerce público## 📁 Estructura del Proyecto

│   └── components/ # Módulos de compra

├── auth/           # Autenticación```

├── core/           # Servicios compartidossrc/app/

│   ├── guards/     # Guards de autenticación├── core/

│   ├── http/       # Interceptores HTTP│   ├── models/              # Interfaces TypeScript (Catalog, Sales, Inventory, Analytics)

│   ├── layouts/    # Layouts de la app│   ├── services/            # ApiService centralizado (todos los endpoints)

│   ├── models/     # Modelos de datos│   ├── state/               # CartStore con Signals

│   └── services/   # Servicios core│   ├── guards/              # Auth guards

└── shared/         # Componentes compartidos│   ├── http/                # Interceptors (OAuth2, JWT)

    ├── components/│   └── layouts/             # App layout (sidebar, topbar)

    └── services/│

```├── dashboard/               # Panel de administración

│   ├── components/

---│   │   ├── home/           # Dashboard principal con métricas

│   │   ├── product/        # Gestión de productos

## 📦 Requisitos│   │   ├── warehouses/     # Gestión de almacenes

│   │   ├── inventory/      # Control de inventario

- **Node.js**: >= 20.x│   │   ├── cart/           # Carrito de compras

- **npm**: >= 10.x│   │   ├── ai-reports/     # Reportes con IA

- **Angular CLI**: 20.1.5│   │   └── ...

│   └── dashboard.routes.ts

---│

├── auth/                    # Login y registro

## 🚀 Instalación├── landing/                 # Landing page público

└── environments/            # Configuración (dev/prod)

### 1. Clonar el repositorio```



```bash---

git clone https://github.com/marcelojp03/si2-pacial2-fe-angular.git

cd si2-pacial2-fe-angular## 🎯 Features Implementados

```

### ✅ Core (100%)

### 2. Instalar dependencias- [x] Modelos TypeScript completos

- [x] ApiService con todos los endpoints

```bash- [x] CartStore con Signals

npm install- [x] Auth guards y interceptors

```- [x] Configuración de entorno



### 3. Configurar variables de entorno### 🚧 UI (40%)

- [x] Landing page

Editar `src/environments/environment.ts`:- [x] Login/Register

- [x] Dashboard layout

```typescript- [ ] Catálogo de productos (pendiente)

export const environment = {- [ ] Carrito de compras (pendiente)

  production: false,- [ ] Checkout (pendiente)

  api: {- [ ] Dashboard con gráficos (pendiente)

    baseUrl: 'http://localhost:8000/api',- [ ] Reportes con prompts (pendiente)

    timeout: 30000

  },### 📊 Admin (30%)

  // ... otras configuraciones- [x] Productos (adaptado de MRP)

};- [x] Almacenes

```- [x] Inventario

- [ ] Clientes

### 4. Ejecutar en desarrollo- [ ] Órdenes

- [ ] Categorías

```bash

npm start---

# o

ng serve## 🛠️ Tecnologías

```

- **Angular:** 20.1.5 (standalone components)

La aplicación estará disponible en `http://localhost:4200/`- **PrimeNG:** 20.0.1 (UI components)

- **Tailwind CSS:** 3.4.17 (utilidades)

---- **Chart.js:** Para gráficos (ng2-charts)

- **RxJS:** 7.8.0 (manejo de estado)

## 📜 Comandos Disponibles- **TypeScript:** 5.8.3



```bash---

# Desarrollo

npm start              # Ejecutar servidor de desarrollo## 📚 Documentación

npm run build          # Build para producción

npm run watch          # Build en modo watch### Para Desarrolladores

npm test               # Ejecutar tests- **QUICKSTART.md** - Inicio rápido y comandos útiles

- **IMPLEMENTATION_GUIDE.md** - Guía completa de implementación de componentes

# Scripts de utilidad (ver scripts/)- **ECOMMERCE_STATUS.md** - Estado actual del proyecto

npm run lint           # Ejecutar linter

npm run format         # Formatear código con Prettier### API

```- **docs/API_DOCUMENTATION.md** - Documentación completa de la API

- **docs/API_QUICK_REFERENCE.md** - Referencia rápida de endpoints

---

---

## 📁 Estructura del Proyecto

## 🔧 Configuración

```

ecommerce-angular-fe/### Backend URL

├── docs/                           # Documentación del proyecto

│   ├── API_DOCUMENTATION.md        # Documentación de la APIEn `src/environments/environment.ts`:

│   ├── API_QUICK_REFERENCE.md      # Referencia rápida de endpoints

│   ├── COMPONENT_STANDARDS.md      # Estándares de componentes```typescript

│   ├── AUTENTICACION.md           # Sistema de autenticaciónexport const environment = {

│   └── ...  production: false,

├── scripts/                        # Scripts de utilidad PowerShell  api: {

│   ├── fix-all-errors.ps1    baseUrl: 'http://127.0.0.1:8000/api',

│   ├── fix-environment.ps1    timeout: 30000,

│   └── ...  },

├── src/  mock: false,

│   ├── app/};

│   │   ├── admin/                  # Módulo de administración```

│   │   │   ├── components/

│   │   │   │   ├── catalog/        # Gestión de productos---

│   │   │   │   ├── categories/     # Gestión de categorías

│   │   │   │   ├── customers/      # Gestión de clientes## 🧪 Testing

│   │   │   │   ├── orders/         # Gestión de pedidos

│   │   │   │   ├── inventory/      # Gestión de inventario```bash

│   │   │   │   ├── warehouses/     # Gestión de almacenes# Unit tests

│   │   │   │   ├── suppliers/      # Gestión de proveedoresng test

│   │   │   │   └── home/           # Dashboard principal

│   │   │   └── admin.routes.ts# Build

│   │   ├── shopping/               # Módulo de e-commerceng build --configuration production

│   │   │   ├── components/```

│   │   │   │   ├── catalog/        # Catálogo de productos

│   │   │   │   ├── cart/           # Carrito de compras---

│   │   │   │   ├── orders/         # Pedidos del cliente

│   │   │   │   └── home/           # Página principal## 🐛 Troubleshooting

│   │   │   └── shopping.routes.ts

│   │   ├── auth/                   # Autenticación### CORS Error

│   │   ├── core/                   # Funcionalidad coreAsegúrate de que Django tenga CORS configurado:

│   │   └── shared/                 # Componentes compartidos```python

│   ├── assets/                     # Recursos estáticosCORS_ALLOWED_ORIGINS = [

│   ├── environments/               # Configuración de entornos    "http://localhost:4200",

│   └── styles.scss                 # Estilos globales]

├── angular.json                    # Configuración de Angular```

├── package.json                    # Dependencias del proyecto

├── tailwind.config.js              # Configuración de Tailwind### Chart.js no funciona

└── tsconfig.json                   # Configuración de TypeScript```bash

```npm install ng2-charts chart.js

```

---

---

## 🌐 Rutas de la Aplicación

## 📞 API Endpoints Principales

### **Shopping (Público)**

- `/` - Página principal del e-commerce### Catálogo

- `/shop` - Catálogo de productos- `GET /api/catalog/products/` - Lista de productos

- `/shop/products/:id` - Detalle de producto- `GET /api/catalog/categories/` - Lista de categorías

- `/cart` - Carrito de compras

- `/checkout` - Proceso de pago### Ventas

- `/my-orders` - Mis pedidos- `POST /api/sales/carts/{id}/add_item/` - Agregar al carrito

- `POST /api/sales/carts/{id}/checkout/` - Crear orden

### **Admin (Protegido)**

- `/admin` - Dashboard principal### Analytics

- `/admin/products` - Gestión de productos- `GET /api/analytics/sales/dashboard/` - Dashboard de ventas

- `/admin/categories` - Gestión de categorías- `POST /api/analytics/sales/generate_report/` - Generar reporte

- `/admin/orders` - Gestión de pedidos

- `/admin/customers` - Gestión de clientes**Ver documentación completa en `docs/`**

- `/admin/inventory` - Gestión de inventario

- `/admin/warehouses` - Gestión de almacenes---

- `/admin/suppliers` - Gestión de proveedores

## 🎯 Próximos Pasos

### **Autenticación**

- `/auth/login` - Iniciar sesión1. [ ] Crear ProductsListComponent

- `/auth/register` - Registrarse2. [ ] Crear CartPageComponent

3. [ ] Actualizar Dashboard con gráficos

---4. [ ] Implementar reportes con prompts

5. [ ] Agregar soporte de voz (Web Speech API)

## 📚 Documentación

Ver **IMPLEMENTATION_GUIDE.md** para código completo.

### Guías Principales (raíz)

- **[README.md](./README.md)** - Este archivo---

- Ver carpeta **docs/** para documentación técnica completa

**¿Necesitas ayuda?** Revisa los archivos de documentación en la raíz del proyecto.

### Documentación Técnica (docs/)

- **[QUICKSTART.md](./docs/QUICKSTART.md)** - Guía de inicio rápido🚀 **¡Happy Coding!**

- **[COMPONENT_STANDARDS.md](./docs/COMPONENT_STANDARDS.md)** - Estándares de componentes
- **[ROUTE_MAPPING.md](./docs/ROUTE_MAPPING.md)** - Mapeo de rutas
- **[AUTENTICACION.md](./docs/AUTENTICACION.md)** - Sistema de autenticación
- **[IMPLEMENTATION_SUMMARY.md](./docs/IMPLEMENTATION_SUMMARY.md)** - Resumen de implementación
- **[API_DOCUMENTATION.md](./docs/API_DOCUMENTATION.md)** - Documentación completa de la API
- **[API_QUICK_REFERENCE.md](./docs/API_QUICK_REFERENCE.md)** - Referencia rápida de endpoints
- **[FRONTEND_COMPONENTS_GUIDE.md](./docs/FRONTEND_COMPONENTS_GUIDE.md)** - Guía de componentes frontend

---

## 🛠️ Tecnologías

### **Core**
- **Angular 20.1.5** - Framework principal
- **TypeScript 5.7** - Lenguaje de programación
- **RxJS 7.8** - Programación reactiva

### **UI/UX**
- **PrimeNG 20.0.1** - Librería de componentes UI
- **PrimeIcons 7.0.0** - Iconos
- **TailwindCSS 3.4** - Framework de CSS utility-first
- **SASS** - Preprocesador CSS

### **State Management**
- **Signals (Angular 20)** - Gestión de estado reactivo
- **RxJS Stores** - Para estados complejos

### **HTTP & API**
- **Angular HttpClient** - Cliente HTTP
- **JWT** - Autenticación basada en tokens
- **Interceptores** - Para manejo de auth y errores

### **Utilidades**
- **ESLint** - Linter
- **Prettier** - Formateador de código

---

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es privado y confidencial.

---

## 👥 Equipo

Desarrollado por el equipo de la Universidad Autónoma Gabriel René Moreno (UAGRM)

---

## 📞 Soporte

Para soporte y consultas:
- GitHub Issues: [Crear Issue](https://github.com/marcelojp03/si2-pacial2-fe-angular/issues)

---

**Última actualización:** Noviembre 2025
