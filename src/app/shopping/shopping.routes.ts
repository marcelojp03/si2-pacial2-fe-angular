// shopping.routes.ts
import { Routes } from '@angular/router';
import { ShoppingComponent } from './shopping.component';
import { checkoutGuard } from '../core/guards/checkout.guard';

export const shoppingRoutes: Routes = [
  {
    path: '',
    component: ShoppingComponent,
    children: [
      // ========================================
      // LANDING PAGE (Home pública)
      // ========================================
      {
        path: '',
        loadComponent: () =>
          import('./components/home/home.component').then(m => m.ShoppingHomeComponent)
      },
      
      // ========================================
      // CATÁLOGO DE PRODUCTOS (Pública)
      // ========================================
      {
        path: 'products',
        loadComponent: () =>
          import('./components/catalog/products-list.component').then(m => m.ProductsListComponent)
      },
      {
        path: 'products/:id',
        loadComponent: () =>
          import('./components/catalog/product-detail.component').then(m => m.ProductDetailComponent)
      },
      
      // ========================================
      // CARRITO & CHECKOUT (Requiere autenticación)
      // ========================================
      {
        path: 'cart',
        canActivate: [checkoutGuard],
        loadComponent: () =>
          import('./components/cart/cart-page.component').then(m => m.CartPageComponent)
      },
      {
        path: 'checkout',
        canActivate: [checkoutGuard],
        loadComponent: () =>
          import('./components/checkout/checkout.component').then(m => m.CheckoutComponent)
      },
      {
        path: 'confirmation',
        canActivate: [checkoutGuard],
        loadComponent: () =>
          import('./components/confirmation/confirmation.component').then(m => m.ConfirmationComponent)
      },
      
      // ========================================
      // MIS PEDIDOS (Requiere autenticación)
      // ========================================
      {
        path: 'my-orders',
        canActivate: [checkoutGuard],
        loadComponent: () =>
          import('./components/orders/my-orders.component').then(m => m.MyOrdersComponent)
      },
      {
        path: 'my-orders/:id',
        canActivate: [checkoutGuard],
        loadComponent: () =>
          import('./components/orders/order-detail.component').then(m => m.OrderDetailComponent)
      },
      
      // ========================================
      // PERFIL DE CLIENTE (Requiere autenticación)
      // ========================================
      {
        path: 'profile',
        canActivate: [checkoutGuard],
        loadComponent: () =>
          import('./components/profile/customer-profile.component').then(m => m.CustomerProfileComponent)
      },
    ]
  }
];
