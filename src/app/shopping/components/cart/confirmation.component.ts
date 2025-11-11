import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [SharedModule],
  template: `
    <div class="surface-ground px-4 py-8 md:px-6 lg:px-8">
      <div class="max-w-2xl mx-auto">
        <p-card>
          <ng-template pTemplate="header">
            <div class="text-center pt-6">
              <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/20 mb-4">
                <i class="pi pi-check text-5xl text-green-600"></i>
              </div>
            </div>
          </ng-template>

          <div class="text-center">
            <h1 class="text-3xl font-bold text-surface-900 dark:text-surface-0 mb-4">
              ¡Pedido Realizado con Éxito!
            </h1>
            
            <p class="text-lg text-surface-600 dark:text-surface-400 mb-4">
              Felicidades por tu compra. Tu orden ha sido recibida y está siendo procesada.
            </p>

            <div class="bg-surface-50 dark:bg-surface-800 rounded-lg p-4 mb-6">
              <p class="text-surface-700 dark:text-surface-300">
                <i class="pi pi-envelope mr-2"></i>
                Recibirás un correo de confirmación con los detalles de tu pedido.
              </p>
            </div>

            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <p-button
                label="Ver mis pedidos"
                icon="pi pi-list"
                severity="secondary"
                [outlined]="true"
                (onClick)="goToOrders()"
              />
              <p-button
                label="Continuar comprando"
                icon="pi pi-shopping-bag"
                iconPos="right"
                (onClick)="goToHome()"
              />
            </div>
          </div>

          <ng-template pTemplate="footer">
            <div class="border-t border-surface-200 dark:border-surface-700 pt-4">
              <div class="flex items-start gap-3 text-sm text-surface-600 dark:text-surface-400">
                <i class="pi pi-info-circle text-lg"></i>
                <div>
                  <p class="font-semibold mb-1">¿Necesitas ayuda?</p>
                  <p>Contacta a nuestro equipo de soporte si tienes alguna pregunta sobre tu pedido.</p>
                </div>
              </div>
            </div>
          </ng-template>
        </p-card>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ConfirmationComponent implements OnInit {
  private router = inject(Router);

  ngOnInit(): void {
    // Opcional: limpiar el carrito si llegamos aquí
  }

  goToHome() {
    this.router.navigate(['/']);
  }

  goToOrders() {
    this.router.navigate(['/my-orders']);
  }
}
