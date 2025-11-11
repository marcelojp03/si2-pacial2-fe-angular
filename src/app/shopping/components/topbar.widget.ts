import { Component, inject, computed } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CartStore } from '../../core/state/cart.store';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-topbar-widget',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    MenubarModule,
    BadgeModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule
  ],
  template: `
    <div class="surface-card shadow-md border-b border-surface-200">
      <div class="px-6 py-4 lg:px-20">
        <p-menubar [model]="menuItems" styleClass="border-0 p-0 bg-transparent">
          <ng-template #start>
            <a routerLink="/" class="flex items-center cursor-pointer mr-8">
              <i class="pi pi-shopping-bag text-primary" style="font-size: 2rem"></i>
              <span class="text-surface-900 dark:text-surface-0 font-bold text-2xl ml-3">E-Shop</span>
            </a>
          </ng-template>
          
          <ng-template #end>
            <div class="flex items-center gap-2">
              <!-- Búsqueda -->
              <p-iconfield iconPosition="left" class="hidden md:block">
                <p-inputicon styleClass="pi pi-search" />
                <input type="text" pInputText placeholder="Buscar productos..." class="w-64" />
              </p-iconfield>
              
              <!-- Carrito -->
              <p-button 
                icon="pi pi-shopping-cart"
                [badge]="cart.totalItems().toString()"
                [rounded]="true"
                [text]="true"
                severity="success"
                routerLink="/cart"
                styleClass="relative"
              />
              
              <!-- Usuario Logueado o Login -->
              @if (isLoggedIn()) {
                <p-button 
                  [label]="userName()"
                  icon="pi pi-user"
                  [rounded]="true"
                  [text]="true"
                  styleClass="font-semibold"
                  (onClick)="menu.toggle($event)"
                />
                <p-menu #menu [model]="userMenuItems" [popup]="true" />
              } @else {
                <p-button 
                  label="Ingresar"
                  icon="pi pi-sign-in"
                  [rounded]="true"
                  [outlined]="true"
                  severity="primary"
                  routerLink="/auth/login"
                />
              }
            </div>
          </ng-template>
        </p-menubar>
      </div>
    </div>
  `
})
export class TopbarWidget {
  router = inject(Router);
  cart = inject(CartStore);
  authService = inject(AuthService);

  // Computed signals para usuario logueado
  isLoggedIn = computed(() => this.authService.isAuthenticated());
  userName = computed(() => {
    const user = this.authService.getCurrentUser();
    return user?.first_name || user?.email?.split('@')[0] || 'Usuario';
  });

  userMenuItems = [
    {
      label: 'Mi Perfil',
      icon: 'pi pi-user',
      command: () => this.router.navigate(['/profile'])
    },
    {
      label: 'Mis Pedidos',
      icon: 'pi pi-box',
      command: () => this.router.navigate(['/my-orders'])
    },
    {
      separator: true
    },
    {
      label: 'Cerrar Sesión',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];

  menuItems = [
    {
      label: 'Inicio',
      icon: 'pi pi-fw pi-home',
      routerLink: '/'
    },
    {
      label: 'Productos',
      icon: 'pi pi-fw pi-shopping-bag',
      routerLink: '/products'
    },
    {
      label: 'Categorías',
      icon: 'pi pi-fw pi-list',
      items: [
        {
          label: 'Todas las Categorías',
          icon: 'pi pi-fw pi-th-large',
          routerLink: '/products'
        },
        {
          separator: true
        },
        {
          label: 'Ropa',
          icon: 'pi pi-fw pi-tag',
          routerLink: '/products',
          queryParams: { category: 'clothing' }
        },
        {
          label: 'Accesorios',
          icon: 'pi pi-fw pi-sparkles',
          routerLink: '/products',
          queryParams: { category: 'accessories' }
        },
        {
          label: 'Electrónica',
          icon: 'pi pi-fw pi-mobile',
          routerLink: '/products',
          queryParams: { category: 'electronics' }
        }
      ]
    },
    {
      label: 'Mis Pedidos',
      icon: 'pi pi-fw pi-box',
      routerLink: '/my-orders'
    }
  ];

  logout() {
    this.authService.logout();
    this.cart.clear();
    this.router.navigate(['/']);
  }
}
