import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { MessageService } from 'primeng/api';

// Services
import { CartStore } from '../../../core/state/cart.store';
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    SharedModule
  ],
  providers: [MessageService],
  template: `
    <div class="card">
      <p-toast />
      
      <h3 class="text-3xl font-bold mb-4">Finalizar Compra</h3>

      @if (cart.items().length === 0) {
        <div class="text-center py-12">
          <i class="pi pi-shopping-cart text-6xl text-muted-color mb-4"></i>
          <p class="text-xl text-muted-color mb-4">No tienes productos en el carrito</p>
          <p-button 
            label="Ir a comprar" 
            icon="pi pi-arrow-left"
            (onClick)="goToProducts()"
          />
        </div>
      } @else {
        <div class="grid">
          <!-- Formulario -->
          <div class="col-12 lg:col-8">
            <form [formGroup]="checkoutForm">
              <!-- Información del Cliente -->
              <p-card class="mb-4">
                <ng-template pTemplate="header">
                  <div class="p-4 pb-0">
                    <h4 class="text-xl font-bold">Información del Cliente</h4>
                  </div>
                </ng-template>

                <div class="grid">
                  <div class="col-12">
                    <label class="block mb-2 font-semibold">Nombre Completo *</label>
                    <input 
                      pInputText 
                      formControlName="fullName"
                      placeholder="Ej: Juan Pérez"
                      class="w-full"
                    />
                    @if (checkoutForm.get('fullName')?.invalid && checkoutForm.get('fullName')?.touched) {
                      <small class="text-red-500">El nombre es requerido</small>
                    }
                  </div>

                  <div class="col-12 md:col-6">
                    <label class="block mb-2 font-semibold">Email *</label>
                    <input 
                      pInputText 
                      formControlName="email"
                      type="email"
                      placeholder="ejemplo@email.com"
                      class="w-full"
                    />
                    @if (checkoutForm.get('email')?.invalid && checkoutForm.get('email')?.touched) {
                      <small class="text-red-500">Email inválido</small>
                    }
                  </div>

                  <div class="col-12 md:col-6">
                    <label class="block mb-2 font-semibold">Teléfono *</label>
                    <input 
                      pInputText 
                      formControlName="phone"
                      placeholder="Ej: 70123456"
                      class="w-full"
                    />
                    @if (checkoutForm.get('phone')?.invalid && checkoutForm.get('phone')?.touched) {
                      <small class="text-red-500">El teléfono es requerido</small>
                    }
                  </div>

                  <div class="col-12 md:col-6">
                    <label class="block mb-2 font-semibold">CI/NIT</label>
                    <input 
                      pInputText 
                      formControlName="ciNit"
                      placeholder="Ej: 1234567"
                      class="w-full"
                    />
                  </div>
                </div>
              </p-card>

              <!-- Dirección de Envío -->
              <p-card class="mb-4">
                <ng-template pTemplate="header">
                  <div class="p-4 pb-0">
                    <h4 class="text-xl font-bold">Dirección de Envío</h4>
                  </div>
                </ng-template>

                <div class="grid">
                  <div class="col-12">
                    <label class="block mb-2 font-semibold">Dirección *</label>
                    <input 
                      pInputText 
                      formControlName="address"
                      placeholder="Av. Principal #123"
                      class="w-full"
                    />
                    @if (checkoutForm.get('address')?.invalid && checkoutForm.get('address')?.touched) {
                      <small class="text-red-500">La dirección es requerida</small>
                    }
                  </div>

                  <div class="col-12 md:col-6">
                    <label class="block mb-2 font-semibold">Ciudad *</label>
                    <input 
                      pInputText 
                      formControlName="city"
                      placeholder="Santa Cruz"
                      class="w-full"
                    />
                  </div>

                  <div class="col-12 md:col-6">
                    <label class="block mb-2 font-semibold">Código Postal</label>
                    <input 
                      pInputText 
                      formControlName="zip"
                      placeholder="0000"
                      class="w-full"
                    />
                  </div>

                  <div class="col-12">
                    <label class="block mb-2 font-semibold">Notas de Entrega</label>
                    <textarea 
                      pInputText 
                      formControlName="notes"
                      rows="3"
                      placeholder="Ej: Casa blanca, segunda puerta"
                      class="w-full"
                    ></textarea>
                  </div>
                </div>
              </p-card>

              <!-- Método de Pago -->
              <p-card>
                <ng-template pTemplate="header">
                  <div class="p-4 pb-0">
                    <h4 class="text-xl font-bold">Método de Pago</h4>
                  </div>
                </ng-template>

                <div class="grid">
                  <div class="col-12">
                    <p-select
                      formControlName="paymentMethod"
                      [options]="paymentMethods"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Selecciona un método de pago"
                      styleClass="w-full"
                    />
                  </div>
                </div>
              </p-card>
            </form>
          </div>

          <!-- Resumen -->
          <div class="col-12 lg:col-4">
            <p-card>
              <ng-template pTemplate="header">
                <div class="p-4 pb-0">
                  <h4 class="text-xl font-bold">Resumen del Pedido</h4>
                </div>
              </ng-template>

              <!-- Items -->
              <div class="mb-4">
                <div class="font-semibold mb-2">Productos ({{ cart.totalItems() }})</div>
                @for (item of cart.items(); track item.variantId) {
                  <div class="flex justify-between text-sm mb-2">
                    <span>{{ item.name }} x{{ item.qty }}</span>
                    <span>Bs. {{ item.price * item.qty | number:'1.2-2' }}</span>
                  </div>
                }
              </div>

              <div class="border-t border-surface-200 dark:border-surface-700 pt-3 mb-3"></div>

              <div class="space-y-2 mb-4">
                <div class="flex justify-between text-muted-color">
                  <span>Subtotal:</span>
                  <span>Bs. {{ cart.totalAmount() | number:'1.2-2' }}</span>
                </div>

                <div class="flex justify-between text-muted-color">
                  <span>IVA (13%):</span>
                  <span>Bs. {{ cart.totalAmount() * 0.13 | number:'1.2-2' }}</span>
                </div>

                <div class="flex justify-between text-muted-color">
                  <span>Envío:</span>
                  <span>{{ cart.totalAmount() * 1.13 >= 200 ? 'Gratis' : 'Bs. 20.00' }}</span>
                </div>
              </div>

              <div class="border-t border-surface-200 dark:border-surface-700 pt-3 mb-4"></div>

              <div class="flex justify-between text-2xl font-bold mb-4">
                <span>Total:</span>
                <span class="text-primary">Bs. {{ getTotal() | number:'1.2-2' }}</span>
              </div>

              <ng-template pTemplate="footer">
                <div class="space-y-2">
                  <p-button 
                    label="Confirmar Pedido" 
                    icon="pi pi-check"
                    severity="success"
                    class="w-full"
                    size="large"
                    [loading]="processing()"
                    [disabled]="checkoutForm.invalid"
                    (onClick)="processCheckout()"
                  />
                  <p-button 
                    label="Volver al Carrito" 
                    icon="pi pi-arrow-left"
                    [outlined]="true"
                    class="w-full"
                    (onClick)="goToCart()"
                  />
                </div>
              </ng-template>
            </p-card>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .space-y-2 > * + * {
      margin-top: 0.5rem;
    }
  `]
})
export class CheckoutComponent implements OnInit {
  cart = inject(CartStore);
  private api = inject(ApiService);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  processing = signal(false);

  checkoutForm: FormGroup;

  paymentMethods = [
    { label: 'Tarjeta de Crédito', value: 'CREDIT_CARD' },
    { label: 'Tarjeta de Débito', value: 'DEBIT_CARD' },
    { label: 'Pago Contra Entrega', value: 'CASH_ON_DELIVERY' },
    { label: 'Transferencia Bancaria', value: 'BANK_TRANSFER' }
  ];

  constructor() {
    this.checkoutForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      ciNit: [''],
      address: ['', Validators.required],
      city: ['Santa Cruz', Validators.required],
      zip: ['0000'],
      notes: [''],
      paymentMethod: ['CASH_ON_DELIVERY', Validators.required]
    });
  }

  ngOnInit() {
    this.cart.loadFromLocalStorage();
  }

  getTotal(): number {
    const subtotal = this.cart.totalAmount();
    const iva = subtotal * 0.13;
    const shipping = (subtotal * 1.13) >= 200 ? 0 : 20;
    return subtotal + iva + shipping;
  }

  processCheckout() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Formulario incompleto',
        detail: 'Por favor completa todos los campos requeridos'
      });
      return;
    }

    this.processing.set(true);

    // Simulación de checkout (en producción usar API real)
    setTimeout(() => {
      this.cart.clear();
      this.processing.set(false);
      
      this.messageService.add({
        severity: 'success',
        summary: '¡Pedido Confirmado!',
        detail: 'Tu pedido ha sido procesado exitosamente',
        life: 5000
      });

      setTimeout(() => {
        this.router.navigate(['/admin/orders']);
      }, 2000);
    }, 2000);
  }

  goToCart() {
    this.router.navigate(['/admin/cart']);
  }

  goToProducts() {
    this.router.navigate(['/admin/products']);
  }
}
