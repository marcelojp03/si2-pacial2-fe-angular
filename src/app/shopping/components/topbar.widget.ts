import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CartStore } from '../../core/state/cart.store';

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
    <div class="surface-card shadow-sm">
      <div class="px-4 py-3 lg:px-8">
        <p-menubar [model]="menuItems" styleClass="border-0 p-0">
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
              
              <!-- Usuario / Admin -->
              <p-button 
                icon="pi pi-user"
                [rounded]="true"
                [text]="true"
                routerLink="/auth/login"
              />
              
              <p-button 
                icon="pi pi-cog"
                [rounded]="true"
                [outlined]="true"
                severity="secondary"
                routerLink="/admin"
                styleClass="ml-2"
              />
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
}
