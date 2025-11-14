// admin.routes.ts
import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      // ========================================
      // 1. INICIO (pi-home) - Panel principal
      // ========================================
      {
        path: '',
        loadComponent: () =>
          import('./components/home/home.component').then(m => m.HomeComponent)
      },
      { path: 'home', redirectTo: '', pathMatch: 'full' },
      
      // Dashboard - Panel con métricas
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      
      // ========================================
      // 2. CATÁLOGO (pi-box) - Productos y categorías
      // ========================================
      
      // Productos - CRUD completo
      {
        path: 'catalog/products',
        loadChildren: () =>
          import('./components/product/product.routes').then(m => m.productRoutes)
      },
      
      // Categorías - CRUD completo
      {
        path: 'catalog/categories',
        loadComponent: () =>
          import('./components/categories/categories-list.component').then(m => m.CategoriesListComponent)
      },
      
      // Atributos - CRUD completo (NUEVO)
      {
        path: 'catalog/attributes',
        loadComponent: () =>
          import('./components/catalog/attributes-list.component').then(m => m.AttributesListComponent)
      },
      
      // ========================================
      // 3. INVENTARIO (pi-database) - Stock y almacenes
      // ========================================
      
      // Stock - Lista y gestión
      {
        path: 'inventory/stock',
        loadChildren: () =>
          import('./components/inventory/inventory.routes').then(m => m.inventoryRoutes)
      },
      
      // Almacenes - CRUD completo
      {
        path: 'inventory/warehouses',
        loadChildren: () =>
          import('./components/warehouses/warehouses.routes').then(m => m.warehousesRoutes)
      },
      
      // Movimientos - Registro de movimientos
      {
        path: 'inventory/movements',
        loadChildren: () =>
          import('./components/movements/movements.routes').then(m => m.movementsRoutes)
      },
      
      // Ajustes - Ajustes de inventario (NUEVO)
      {
        path: 'inventory/adjustments',
        loadComponent: () =>
          import('./components/inventory/adjustments-list.component').then(m => m.AdjustmentsListComponent)
      },
      
      // ========================================
      // 4. VENTAS (pi-shopping-cart) - Pedidos y pagos
      // ========================================
      
      // Pedidos - Lista y detalle
      {
        path: 'sales/orders',
        loadComponent: () =>
          import('./components/orders/orders-list.component').then(m => m.OrdersListComponent)
      },
      {
        path: 'sales/orders/:id',
        loadComponent: () =>
          import('./components/orders/order-detail.component').then(m => m.OrderDetailComponent)
      },
      
      // Pagos - Registro de transacciones (NUEVO)
      {
        path: 'sales/payments',
        loadComponent: () =>
          import('./components/sales/payments-list.component').then(m => m.PaymentsListComponent)
      },
      
      // Envíos - Seguimiento de entregas (NUEVO)
      {
        path: 'sales/shipments',
        loadComponent: () =>
          import('./components/sales/shipments-list.component').then(m => m.ShipmentsListComponent)
      },
      
      // ========================================
      // 5. CLIENTES (pi-users) - Gestión de clientes
      // ========================================
      
      // Clientes - CRUD completo
      {
        path: 'customers',
        loadComponent: () =>
          import('./components/customers/customers-list.component').then(m => m.CustomersListComponent)
      },
      
      // Direcciones - CRUD de direcciones (NUEVO)
      {
        path: 'customers/addresses',
        loadComponent: () =>
          import('./components/customers/addresses-list.component').then(m => m.AddressesListComponent)
      },
      
      // ========================================
      // 6. ANALYTICS (pi-chart-bar) - Reportes con IA
      // ========================================
      
      // Reportes IA - Generación con IA
      {
        path: 'analytics/ai-reports',
        loadComponent: () =>
          import('./components/ai-reports/ai-reports.component').then(m => m.AIReportsComponent)
      },
      
      // Predicciones - Forecasting con IA (NUEVO)
      {
        path: 'analytics/forecasting',
        loadComponent: () =>
          import('./components/analytics/forecasting.component').then(m => m.ForecastingComponent)
      },
      
      // Estadísticas - Métricas y KPIs (NUEVO)
      {
        path: 'analytics/stats',
        loadComponent: () =>
          import('./components/analytics/stats.component').then(m => m.StatsComponent)
      },
      
      // ========================================
      // 7. ADMINISTRACIÓN (pi-cog) - Sistema
      // ========================================
      
      // Usuarios - Gestión de usuarios
      {
        path: 'administration/users',
        loadComponent: () =>
          import('./components/org-users/org-users.component').then(m => m.OrgUsersComponent)
      },
      
      // Roles - Gestión de roles
      {
        path: 'administration/roles',
        loadComponent: () =>
          import('./components/roles/roles.component').then(m => m.RolesComponent)
      },
      
      // ========================================
      // LEGACY ROUTES (mantener compatibilidad)
      // ========================================
      
      // Redirects antiguos a nuevas rutas
      { path: 'products', redirectTo: 'catalog/products', pathMatch: 'full' },
      { path: 'categories', redirectTo: 'catalog/categories', pathMatch: 'full' },
      { path: 'warehouses', redirectTo: 'inventory/warehouses', pathMatch: 'full' },
      { path: 'inventory', redirectTo: 'inventory/stock', pathMatch: 'full' },
      { path: 'movements', redirectTo: 'inventory/movements', pathMatch: 'full' },
      { path: 'orders', redirectTo: 'sales/orders', pathMatch: 'full' },
      { path: 'users', redirectTo: 'administration/users', pathMatch: 'full' },
      { path: 'roles', redirectTo: 'administration/roles', pathMatch: 'full' },
      { path: 'ai-reports', redirectTo: 'analytics/ai-reports', pathMatch: 'full' },
      
      // Componentes legacy (mantener temporalmente)
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./components/suppliers/suppliers.routes').then(m => m.suppliersRoutes)
      },
      {
        path: 'stocks/low',
        loadComponent: () =>
          import('./components/stocks-low/stocks-low.component').then(m => m.StocksLowComponent)
      },
      {
        path: 'stocks/reorder-suggestions',
        loadComponent: () =>
          import('./components/reorder-suggestions/reorder-suggestions.component').then(m => m.ReorderSuggestionsComponent)
      },
      {
        path: 'system/backup',
        loadComponent: () =>
          import('./components/backup/backup.component').then(m => m.BackupComponent)
      },
      {
        path: 'system/logs',
        loadComponent: () =>
          import('./components/system-logs/system-logs.component').then(m => m.SystemLogsComponent)
      },
      {
        path: 'subscription',
        loadComponent: () =>
          import('./components/subscription/subscription.component').then(m => m.SubscriptionComponent)
      },
      {
        path: 'reports/csv',
        loadComponent: () =>
          import('./components/csv-export/csv-export.component').then(m => m.CSVExportComponent)
      }
    ]
  }
];
