import { Component, inject, computed, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
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
                <button 
                  class="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-surface-100 transition-colors cursor-pointer"
                  (click)="menu.toggle($event)"
                >
                  @if (userAvatar()) {
                    <img 
                      [src]="userAvatar()" 
                      alt="Avatar"
                      class="w-8 h-8 rounded-full object-cover border-2 border-primary"
                    />
                  } @else {
                    <div class="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
                      {{ getUserInitials() }}
                    </div>
                  }
                  <span class="font-semibold text-surface-900">{{ userName() }}</span>
                </button>
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

  // Convertir Observable a Signal para reactividad
  currentUser = toSignal(this.authService.currentUser$);

  // Computed signals reactivos basados en currentUser
  isLoggedIn = computed(() => {
    const user = this.currentUser();
    return !!user && this.authService.isAuthenticated();
  });
  
  userName = computed(() => {
    const user = this.currentUser();
    return user?.first_name || user?.email?.split('@')[0] || 'Usuario';
  });
  
  userAvatar = computed(() => {
    const user = this.currentUser();
    return user?.avatar || '';
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
      label: 'Mis Pedidos',
      icon: 'pi pi-fw pi-box',
      routerLink: '/my-orders'
    }
  ];

  getUserInitials(): string {
    const user = this.currentUser();
    if (!user) return 'U';
    
    const firstName = user.first_name || '';
    const lastName = user.last_name || '';
    const email = user.email || '';
    
    if (firstName && lastName) {
      return firstName.charAt(0).toUpperCase() + lastName.charAt(0).toUpperCase();
    }
    
    if (firstName) {
      return firstName.charAt(0).toUpperCase();
    }
    
    if (email) {
      return email.charAt(0).toUpperCase();
    }
    
    return 'U';
  }

  logout() {
    this.authService.logout();
    this.cart.clear();
    this.router.navigate(['/']);
  }
}
