import { Component, inject } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { Router, RouterModule } from '@angular/router';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-footer-widget',
  standalone: true,
  imports: [SharedModule, RouterModule, DividerModule],
  template: `
    <div class="surface-section mt-20 py-12">
      <div class="px-4 lg:px-8 max-w-7xl mx-auto">
        <div class="grid grid-cols-12 gap-8">
          <!-- Logo y Descripción -->
          <div class="col-span-12 lg:col-span-4">
            <a routerLink="/" class="flex items-center mb-4 cursor-pointer">
              <i class="pi pi-shopping-bag text-primary" style="font-size: 2.5rem"></i>
              <span class="text-surface-900 dark:text-surface-0 font-bold text-2xl ml-3">E-Shop</span>
            </a>
            <p class="text-surface-600 dark:text-surface-300 leading-relaxed mb-4">
              Tu tienda en línea de confianza. Encuentra los mejores productos de calidad al mejor precio.
            </p>
            <div class="flex gap-3">
              <a class="w-12 h-12 flex items-center justify-center bg-surface-100 dark:bg-surface-800 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all">
                <i class="pi pi-facebook text-xl"></i>
              </a>
              <a class="w-12 h-12 flex items-center justify-center bg-surface-100 dark:bg-surface-800 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all">
                <i class="pi pi-twitter text-xl"></i>
              </a>
              <a class="w-12 h-12 flex items-center justify-center bg-surface-100 dark:bg-surface-800 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all">
                <i class="pi pi-instagram text-xl"></i>
              </a>
              <a class="w-12 h-12 flex items-center justify-center bg-surface-100 dark:bg-surface-800 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all">
                <i class="pi pi-youtube text-xl"></i>
              </a>
            </div>
          </div>

          <!-- Compras -->
          <div class="col-span-12 sm:col-span-6 lg:col-span-2">
            <h4 class="font-semibold text-lg mb-4 text-surface-900 dark:text-surface-0">
              Compras
            </h4>
            <ul class="list-none p-0 m-0">
              <li class="mb-3">
                <a routerLink="/products" class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Catálogo
                </a>
              </li>
              <li class="mb-3">
                <a routerLink="/cart" class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Carrito
                </a>
              </li>
              <li class="mb-3">
                <a routerLink="/my-orders" class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Mis Pedidos
                </a>
              </li>
              <li class="mb-3">
                <a class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Lista de Deseos
                </a>
              </li>
            </ul>
          </div>

          <!-- Información -->
          <div class="col-span-12 sm:col-span-6 lg:col-span-2">
            <h4 class="font-semibold text-lg mb-4 text-surface-900 dark:text-surface-0">
              Información
            </h4>
            <ul class="list-none p-0 m-0">
              <li class="mb-3">
                <a class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Sobre Nosotros
                </a>
              </li>
              <li class="mb-3">
                <a class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Envíos y Devoluciones
                </a>
              </li>
              <li class="mb-3">
                <a class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Métodos de Pago
                </a>
              </li>
              <li class="mb-3">
                <a class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <!-- Servicio al Cliente -->
          <div class="col-span-12 sm:col-span-6 lg:col-span-2">
            <h4 class="font-semibold text-lg mb-4 text-surface-900 dark:text-surface-0">
              Soporte
            </h4>
            <ul class="list-none p-0 m-0">
              <li class="mb-3">
                <a class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Contáctanos
                </a>
              </li>
              <li class="mb-3">
                <a class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Ayuda
                </a>
              </li>
              <li class="mb-3">
                <a class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Seguimiento de Pedido
                </a>
              </li>
              <li class="mb-3">
                <a routerLink="/admin" class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Portal Admin
                </a>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div class="col-span-12 sm:col-span-6 lg:col-span-2">
            <h4 class="font-semibold text-lg mb-4 text-surface-900 dark:text-surface-0">
              Legal
            </h4>
            <ul class="list-none p-0 m-0">
              <li class="mb-3">
                <a class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Privacidad
                </a>
              </li>
              <li class="mb-3">
                <a class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Términos y Condiciones
                </a>
              </li>
              <li class="mb-3">
                <a class="text-surface-600 dark:text-surface-300 hover:text-primary cursor-pointer transition-colors">
                  Cookies
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p-divider styleClass="my-6" />

        <div class="flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="flex items-center gap-2 text-surface-600 dark:text-surface-300">
            <i class="pi pi-copyright"></i>
            <span>2025 E-Shop. Todos los derechos reservados.</span>
          </div>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2 text-surface-600 dark:text-surface-300">
              <i class="pi pi-shield text-xl"></i>
              <span class="text-sm">Compra Segura</span>
            </div>
            <div class="flex items-center gap-2 text-surface-600 dark:text-surface-300">
              <i class="pi pi-truck text-xl"></i>
              <span class="text-sm">Envío Rápido</span>
            </div>
            <div class="flex items-center gap-2 text-surface-600 dark:text-surface-300">
              <i class="pi pi-sync text-xl"></i>
              <span class="text-sm">Devolución Fácil</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class FooterWidget {
  router = inject(Router);
}
