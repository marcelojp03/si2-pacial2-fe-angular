// shopping.routes.ts
import { Routes } from '@angular/router';
import { ShoppingComponent } from './shopping.component';

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
      // CARRITO & CHECKOUT
      // ========================================
      {
        path: 'cart',
        loadComponent: () =>
          import('./components/cart/cart-page.component').then(m => m.CartPageComponent)
      },
      {
        path: 'checkout',
        loadComponent: () =>
          import('./components/cart/checkout.component').then(m => m.CheckoutComponent)
      },
      
      // ========================================
      // MIS PEDIDOS (Requiere autenticación)
      // ========================================
      {
        path: 'my-orders',
        loadComponent: () =>
          import('./components/orders/my-orders.component').then(m => m.MyOrdersComponent)
      },
      {
        path: 'my-orders/:id',
        loadComponent: () =>
          import('./components/orders/order-detail.component').then(m => m.OrderDetailComponent)
      },
    ]
  }
];
