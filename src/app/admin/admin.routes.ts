// admin.routes.ts
import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { HomeComponent } from './components/home/home.component';
import { AIReportsComponent } from './components/ai-reports/ai-reports.component';
import { BackupComponent } from './components/backup/backup.component';
import { SystemLogsComponent } from './components/system-logs/system-logs.component';
import { OrgUsersComponent } from './components/org-users/org-users.component';
import { SubscriptionComponent } from './components/subscription/subscription.component';
import { StocksLowComponent } from './components/stocks-low/stocks-low.component';
import { ReorderSuggestionsComponent } from './components/reorder-suggestions/reorder-suggestions.component';
import { CSVExportComponent } from './components/csv-export/csv-export.component';
import { RolesComponent } from './components/roles/roles.component';

export const adminRoutes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      // Dashboard principal con métricas y forecast
      { path: '', component: HomeComponent },
      { path: 'home', redirectTo: '', pathMatch: 'full' },
      
      // ========================================
      // CATÁLOGO (Gestión de productos)
      // ========================================
      {
        path: 'products',
        loadChildren: () =>
          import('./components/product/product.routes').then(m => m.productRoutes)
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./components/categories/categories-list.component').then(m => m.CategoriesListComponent)
      },
      
      // ========================================
      // INVENTARIO
      // ========================================
      {
        path: 'warehouses',
        loadChildren: () =>
          import('./components/warehouses/warehouses.routes').then(m => m.warehousesRoutes)
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('./components/inventory/inventory.routes').then(m => m.inventoryRoutes)
      },
      {
        path: 'movements',
        loadChildren: () =>
          import('./components/movements/movements.routes').then(m => m.movementsRoutes)
      },
      { path: 'stocks/low', component: StocksLowComponent },
      { path: 'stocks/reorder-suggestions', component: ReorderSuggestionsComponent },
      
      // ========================================
      // VENTAS & CLIENTES
      // ========================================
      {
        path: 'customers',
        loadComponent: () =>
          import('./components/customers/customers-list.component').then(m => m.CustomersListComponent)
      },
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/orders/orders-list.component').then(m => m.OrdersListComponent)
      },
      {
        path: 'orders/:id',
        loadComponent: () =>
          import('./components/orders/order-detail.component').then(m => m.OrderDetailComponent)
      },
      
      // ========================================
      // PROVEEDORES
      // ========================================
      {
        path: 'suppliers',
        loadChildren: () =>
          import('./components/suppliers/suppliers.routes').then(m => m.suppliersRoutes)
      },
      
      // ========================================
      // REPORTES & ANALYTICS
      // ========================================
      { path: 'reports/ai', component: AIReportsComponent },
      { path: 'reports/csv', component: CSVExportComponent },
      
      // ========================================
      // SISTEMA
      // ========================================
      { path: 'system/backup', component: BackupComponent },
      { path: 'system/logs', component: SystemLogsComponent },
      
      // ========================================
      // ADMINISTRACIÓN
      // ========================================
      { path: 'users', component: OrgUsersComponent },
      { path: 'roles', component: RolesComponent },
      
      // Suscripción
      { path: 'subscription', component: SubscriptionComponent },
      
      // Legacy routes (mantener compatibilidad)
      { path: 'ai-reports', redirectTo: 'reports/ai', pathMatch: 'full' },
      { path: 'backup', redirectTo: 'system/backup', pathMatch: 'full' },
      { path: 'system-logs', redirectTo: 'system/logs', pathMatch: 'full' },
      { path: 'org-users', redirectTo: 'users', pathMatch: 'full' },
    ]
  }
];
