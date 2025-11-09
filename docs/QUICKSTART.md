# 🚀 Quick Start - E-Commerce Angular

## 📦 Instalar Dependencias

```powershell
# Instalar Chart.js para gráficos del dashboard
npm install ng2-charts chart.js

# UUID para idempotency keys en pagos
npm install uuid
npm install -D @types/uuid
```

---

## 🏃‍♂️ Ejecutar el Proyecto

```powershell
# Iniciar servidor de desarrollo
ng serve

# Abrir en navegador
# http://localhost:4200
```

---

## 🎯 Crear Componentes Faltantes

### 1. Catálogo de Productos

```powershell
# Navegar a la carpeta de productos
cd src/app/dashboard/components/product

# Crear componente de lista
ng g c products-list --standalone

# Copiar el código de IMPLEMENTATION_GUIDE.md
```

### 2. Carrito de Compras

```powershell
# Crear carpeta cart
mkdir src/app/dashboard/components/cart
cd src/app/dashboard/components/cart

# Crear componente
ng g c cart-page --standalone

# Copiar el código de IMPLEMENTATION_GUIDE.md
```

### 3. Widget de Carrito (opcional - para topbar)

```powershell
# Componente pequeño para mostrar en la barra superior
ng g c cart-widget --standalone
```

---

## 🔧 Configurar Rutas

### En `dashboard.routes.ts`

```typescript
// Agregar estas rutas:
{
  path: 'products',
  loadComponent: () => import('./components/product/products-list/products-list.component')
    .then(m => m.ProductsListComponent)
},
{
  path: 'cart',
  loadComponent: () => import('./components/cart/cart-page/cart-page.component')
    .then(m => m.CartPageComponent)
},
```

---

## 🧪 Testing Rápido

### 1. Verificar que el backend esté corriendo

```powershell
# Hacer una petición de prueba
curl http://127.0.0.1:8000/api/healthz/
```

**Respuesta esperada:**
```json
{
  "status": "healthy",
  "timestamp": "2025-11-05T10:30:00Z"
}
```

### 2. Ver productos disponibles

```powershell
curl http://127.0.0.1:8000/api/catalog/products/
```

### 3. Ver categorías

```powershell
curl http://127.0.0.1:8000/api/catalog/categories/
```

---

## 📊 Actualizar Dashboard con Gráficos

### En `home.component.ts`

1. Importar Chart.js:
```typescript
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
```

2. Agregar al template:
```html
<canvas baseChart [data]="chartData" [options]="chartOptions" [type]="'line'"></canvas>
```

3. Llamar a la API:
```typescript
this.api.getSalesDashboard(30).subscribe(data => {
  // Configurar gráfico
});
```

**Ver código completo en `IMPLEMENTATION_GUIDE.md`**

---

## 🎨 Personalizar Tema

### En `angular.json`

```json
{
  "styles": [
    "src/styles.scss",
    "node_modules/primeicons/primeicons.css"
  ]
}
```

### En `styles.scss`

```scss
// Ya está configurado con Tailwind + PrimeNG
```

---

## 🔐 Configurar Auth (si es necesario)

### En `src/app/core/http/oauth2.interceptor.ts`

```typescript
// Ya está configurado para agregar JWT automáticamente
// Token se guarda en localStorage con key 'ecommerce_token'
```

---

## 🧩 Estructura de Archivos Actual

```
src/app/
├── core/
│   ├── models/              ✅ COMPLETO
│   │   ├── catalog.model.ts
│   │   ├── sales.model.ts
│   │   ├── inventory.model.ts
│   │   ├── analytics.model.ts
│   │   ├── security.model.ts
│   │   └── index.ts
│   ├── services/            ✅ COMPLETO
│   │   └── api.service.ts   (todos los endpoints)
│   ├── state/               ✅ COMPLETO
│   │   └── cart.store.ts    (Signals)
│   └── http/                ✅ Ya existe
│       └── oauth2.interceptor.ts
│
├── dashboard/
│   ├── components/
│   │   ├── home/            🔨 ACTUALIZAR con gráficos
│   │   ├── product/         📦 CREAR products-list
│   │   ├── cart/            📦 CREAR cart-page
│   │   └── ai-reports/      🔨 ACTUALIZAR
│   └── dashboard.routes.ts  ✅ LISTO
│
└── landing/                 ✅ Ya existe
    └── landing.component.ts
```

---

## 📝 Checklist Pre-Presentación

### Backend
- [ ] Servidor Django corriendo en `http://127.0.0.1:8000`
- [ ] Swagger disponible en `/api/docs/`
- [ ] Datos de prueba cargados (productos, categorías)

### Frontend
- [ ] `ng serve` corriendo sin errores
- [ ] Landing page carga correctamente
- [ ] Login funciona (si aplica)
- [ ] Catálogo muestra productos
- [ ] Carrito funciona (agregar, quitar, actualizar cantidad)
- [ ] Dashboard muestra métricas
- [ ] Gráficos se renderizan correctamente

### Features Opcionales
- [ ] Reportes con prompts
- [ ] Comando de voz (solo Chrome/Edge)
- [ ] Forecast en dashboard

---

## 🐛 Troubleshooting

### Error: "Cannot find module 'ng2-charts'"
```powershell
npm install ng2-charts chart.js
```

### Error: CORS al llamar API
1. Verificar que Django tenga CORS configurado:
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:4200",
]
```

2. O crear proxy en Angular:
```json
// proxy.conf.json
{
  "/api": {
    "target": "http://127.0.0.1:8000",
    "secure": false
  }
}
```

```powershell
# Ejecutar con proxy
ng serve --proxy-config proxy.conf.json
```

### Error: "Signal is not a function"
Asegúrate de estar usando Angular 16+:
```powershell
ng version
```

---

## 🎯 Flujo de Trabajo Recomendado

1. **Día 1 (hoy):**
   - ✅ Modelos (LISTO)
   - ✅ ApiService (LISTO)
   - ✅ CartStore (LISTO)
   - 📦 Crear ProductsListComponent (1-2 horas)
   - 🛒 Crear CartPageComponent (1 hora)

2. **Día 2:**
   - 📊 Actualizar Dashboard con gráficos (2 horas)
   - 🎨 Mejorar estilos y UX (2 horas)
   - 🧪 Testing general

3. **Día 3 (opcional):**
   - 🎤 Reportes con prompts
   - 📈 Forecast avanzado
   - 🔐 CRUD Admin completo

---

## 📞 Recursos Útiles

- **API Docs:** `docs/API_DOCUMENTATION.md`
- **Quick Reference:** `docs/API_QUICK_REFERENCE.md`
- **Estado del proyecto:** `ECOMMERCE_STATUS.md`
- **Guía de implementación:** `IMPLEMENTATION_GUIDE.md`

- **PrimeNG:** https://primeng.org/
- **Chart.js:** https://www.chartjs.org/
- **Angular Signals:** https://angular.dev/guide/signals

---

## ✨ Comandos Git (para guardar progreso)

```powershell
git add .
git commit -m "feat: add ecommerce models, services and store"
git push
```

---

¡Éxito en tu presentación! 🚀
