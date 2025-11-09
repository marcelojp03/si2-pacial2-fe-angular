import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';

// PrimeNG
import { MessageService } from 'primeng/api';

// Services
import { CartStore } from '../../../core/state/cart.store';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    SharedModule,],
  providers: [MessageService],
  template: `
    <div class="card">
      <p-toast />
      
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-3xl font-bold">Mi Carrito</h3>
        <div class="flex gap-2">
          <p-button 
            label="Seguir comprando" 
            icon="pi pi-arrow-left"
            [outlined]="true"
            (onClick)="goToProducts()"
          />
        </div>
      </div>

      @if (cart.items().length === 0) {
        <div class="text-center py-12">
          <i class="pi pi-shopping-cart text-6xl text-muted-color mb-4"></i>
          <p class="text-xl text-muted-color mb-4">Tu carrito está vacío</p>
          <p-button 
            label="Ir a comprar" 
            icon="pi pi-arrow-right"
            iconPos="right"
            (onClick)="goToProducts()"
          />
        </div>
      } @else {
        <div class="grid">
          <div class="col-12 lg:col-8">
            <p-table [value]="cart.items()" [tableStyle]="{'min-width': '50rem'}">
              <ng-template pTemplate="header">
                <tr>
                  <th>Producto</th>
                  <th class="text-center">Precio</th>
                  <th class="text-center">Cantidad</th>
                  <th class="text-center">Subtotal</th>
                  <th class="text-center">Acciones</th>
                </tr>
              </ng-template>
              <ng-template pTemplate="body" let-item>
                <tr>
                  <td>
                    <div class="flex items-center gap-3">
                      @if (item.image) {
                        <img 
                          [src]="item.image" 
                          [alt]="item.name"
                          class="w-20 h-20 object-cover rounded shadow-sm"
                        />
                      } @else {
                        <div class="w-20 h-20 bg-surface-100 dark:bg-surface-800 rounded flex items-center justify-center">
                          <i class="pi pi-image text-2xl text-muted-color"></i>
                        </div>
                      }
                      <div>
                        <div class="font-semibold text-lg">{{ item.name }}</div>
                        @if (item.code) {
                          <div class="text-sm text-muted-color">Código: {{ item.code }}</div>
                        }
                      </div>
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="font-semibold">Bs. {{ item.price | number:'1.2-2' }}</div>
                  </td>
                  <td class="text-center">
                    <div class="flex items-center justify-center gap-2">
                      <p-button 
                        icon="pi pi-minus" 
                        size="small"
                        [outlined]="true"
                        [disabled]="item.qty <= 1"
                        (onClick)="cart.decrementQty(item.variantId)"
                      />
                      <span class="font-bold text-lg w-12 text-center">{{ item.qty }}</span>
                      <p-button 
                        icon="pi pi-plus" 
                        size="small"
                        [outlined]="true"
                        (onClick)="cart.incrementQty(item.variantId)"
                      />
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="font-bold text-lg text-primary">
                      Bs. {{ item.price * item.qty | number:'1.2-2' }}
                    </div>
                  </td>
                  <td class="text-center">
                    <p-button 
                      icon="pi pi-trash" 
                      severity="danger"
                      [text]="true"
                      [rounded]="true"
                      (onClick)="removeItem(item.variantId, item.name)"
                    />
                  </td>
                </tr>
              </ng-template>
            </p-table>

            <div class="flex justify-between mt-4">
              <p-button 
                label="Vaciar carrito" 
                icon="pi pi-trash"
                severity="danger"
                [outlined]="true"
                (onClick)="clearCart()"
              />
            </div>
          </div>

          <div class="col-12 lg:col-4">
            <p-card>
              <ng-template pTemplate="header">
                <div class="p-4 pb-0">
                  <h4 class="text-xl font-bold">Resumen del Pedido</h4>
                </div>
              </ng-template>

              <div class="space-y-3">
                <div class="flex justify-between text-muted-color">
                  <span>Subtotal:</span>
                  <span class="font-semibold">Bs. {{ cart.totalAmount() | number:'1.2-2' }}</span>
                </div>

                <div class="flex justify-between text-muted-color">
                  <span>IVA (13%):</span>
                  <span class="font-semibold">Bs. {{ cart.totalAmount() * 0.13 | number:'1.2-2' }}</span>
                </div>

                <div class="border-t border-surface-200 dark:border-surface-700 pt-3"></div>

                <div class="flex justify-between text-xl font-bold">
                  <span>Total:</span>
                  <span class="text-primary">Bs. {{ cart.totalAmount() * 1.13 | number:'1.2-2' }}</span>
                </div>

                <div class="text-sm text-muted-color">
                  <i class="pi pi-box mr-2"></i>
                  {{ cart.totalItems() }} {{ cart.totalItems() === 1 ? 'producto' : 'productos' }}
                </div>
              </div>

              <ng-template pTemplate="footer">
                <p-button 
                  label="Proceder al Pago" 
                  icon="pi pi-credit-card"
                  iconPos="right"
                  severity="success"
                  class="w-full"
                  size="large"
                  (onClick)="goToCheckout()"
                />
              </ng-template>
            </p-card>

            <!-- Info adicional -->
            <div class="mt-4 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
              <div class="flex items-start gap-2 text-sm text-muted-color">
                <i class="pi pi-shield text-primary"></i>
                <div>
                  <div class="font-semibold mb-1">Compra segura</div>
                  <div>Tus datos están protegidos</div>
                </div>
              </div>
            </div>

            <div class="mt-2 p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
              <div class="flex items-start gap-2 text-sm text-muted-color">
                <i class="pi pi-truck text-primary"></i>
                <div>
                  <div class="font-semibold mb-1">Envío gratis</div>
                  <div>En compras mayores a Bs. 200</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .space-y-3 > * + * {
      margin-top: 0.75rem;
    }
  `]
})
export class CartPageComponent implements OnInit {
  cart = inject(CartStore);
  private router = inject(Router);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.cart.loadFromLocalStorage();
  }

  goToProducts() {
    this.router.navigate(['/admin/products']);
  }

  goToCheckout() {
    if (this.cart.items().length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Carrito vacío',
        detail: 'Agrega productos antes de continuar'
      });
      return;
    }
    this.router.navigate(['/admin/checkout']);
  }

  removeItem(variantId: number, productName: string) {
    this.cart.removeItem(variantId);
    this.messageService.add({
      severity: 'info',
      summary: 'Producto eliminado',
      detail: `${productName} se eliminó del carrito`
    });
  }

  clearCart() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      this.cart.clear();
      this.messageService.add({
        severity: 'info',
        summary: 'Carrito vaciado',
        detail: 'Se eliminaron todos los productos'
      });
    }
  }
}
