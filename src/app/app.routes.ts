// app.routes.ts
import { Routes } from '@angular/router';
import { AppLayout } from './core/layouts/component/app.layout';
import { Notfound } from './core/layouts/component/notfound';
import { authGuard, authMatchGuard } from './core/guards/auth.guard';
import { loggedResolver } from './core/guards/logged.guard';

export const appRoutes: Routes = [
    // ========================================
    // SHOPPING (Público - E-commerce)
    // ========================================
    {
        path: '',
        loadChildren: () => import('./shopping/shopping.routes').then(m => m.shoppingRoutes)
    },
    {
        path: 'shop',
        loadChildren: () => import('./shopping/shopping.routes').then(m => m.shoppingRoutes)
    },

    // ========================================
    // ADMIN (Protegido - Panel de Administración)
    // ========================================
    {
        path: 'admin',
        component: AppLayout,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                canMatch: [authMatchGuard],
                loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes)
            }
        ]
    },

    // ========================================
    // AUTH (Login/Register)
    // ========================================
    {
        path: 'auth',
        loadChildren: () => import('./auth/auth.routes').then(m => m.authRoutes),
        resolve: [loggedResolver]
    },

    // ========================================
    // LEGACY ROUTES (Compatibilidad)
    // ========================================
    {
        path: 'landing',
        redirectTo: '',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        redirectTo: 'admin',
        pathMatch: 'prefix'
    },

    // ========================================
    // 404
    // ========================================
    { path: 'not-found', component: Notfound },
    { path: '**', redirectTo: '' }
];
