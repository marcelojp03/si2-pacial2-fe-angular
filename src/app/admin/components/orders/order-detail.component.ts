import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

// Services
import { AdminOrdersService } from './services/admin-orders.service';
import type { Order } from './interfaces/order.interface';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    SharedModule
  ],
  template: `
    <div class="card">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <div>
          <p-button 
            icon="pi pi-arrow-left" 
            [text]="true"
            label="Volver a Pedidos"
            (onClick)="goBack()"
            class="mr-2"
          />
          <h3 class="text-3xl font-bold inline-block">
            Pedido #{{ order()?.order_number || '' }}
          </h3>
          @if (order()?.customer_data) {
            <div class="text-sm text-muted-color mt-1">
              Cliente: {{ order()?.customer_data?.full_name }} ({{ order()?.customer_data?.email }})
            </div>
          }
        </div>
        
        @if (order()) {
          <p-tag 
            [value]="getStatusLabel(order()!.status)" 
            [severity]="getStatusSeverity(order()!.status)"
            styleClass="text-xl px-4 py-2"
          />
        }
      </div>

      @if (loading()) {
        <div class="flex justify-center items-center py-12">
          <i class="pi pi-spin pi-spinner text-4xl"></i>
        </div>
      }

      @if (!loading() && order()) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Información del pedido -->
          <div class="lg:col-span-2">
            <p-card header="Productos del Pedido">
              <p-table [value]="order()!.items" styleClass="p-datatable-striped">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Producto</th>
                    <th class="text-center">Cantidad</th>
                    <th class="text-right">Precio</th>
                    <th class="text-right">Subtotal</th>
                  </tr>
                </ng-template>
                
                <ng-template pTemplate="body" let-item>
                  <tr>
                    <td>
                      <div class="font-semibold">{{ item.variant.code }}</div>
                      @if (item.variant.name) {
                        <div class="text-sm text-muted-color">
                          {{ item.variant.name }}
                        </div>
                      }
                    </td>
                    <td class="text-center">
                      {{ item.qty }}
                    </td>
                    <td class="text-right">
                      {{ order()!.currency }} {{ item.unit_price | number:'1.2-2' }}
                    </td>
                    <td class="text-right font-semibold">
                      {{ order()!.currency }} {{ item.subtotal | number:'1.2-2' }}
                    </td>
                  </tr>
                </ng-template>
              </p-table>

              <p-divider />

              <!-- Totales -->
              <div class="flex flex-col gap-2 max-w-md ml-auto">
                <div class="flex justify-between">
                  <span>Subtotal:</span>
                  <span class="font-semibold">
                    {{ order()!.currency }} {{ order()!.subtotal | number:'1.2-2' }}
                  </span>
                </div>
                
                @if (order()!.discount) {
                  <div class="flex justify-between text-green-600">
                    <span>Descuento:</span>
                    <span class="font-semibold">
                      -{{ order()!.currency }} {{ order()!.discount | number:'1.2-2' }}
                    </span>
                  </div>
                }
                
                @if (order()!.shipping_total) {
                  <div class="flex justify-between">
                    <span>Envío:</span>
                    <span class="font-semibold">
                      {{ order()!.currency }} {{ order()!.shipping_total | number:'1.2-2' }}
                    </span>
                  </div>
                }
                
                <p-divider />
                
                <div class="flex justify-between text-xl">
                  <span class="font-bold">Total:</span>
                  <span class="font-bold text-primary">
                    {{ order()!.currency }} {{ order()!.total | number:'1.2-2' }}
                  </span>
                </div>
              </div>
            </p-card>

            <!-- Dirección de envío -->
            @if (order()!.shipping_address_data) {
              <p-card header="Dirección de Envío" class="mt-4">
                <div class="flex flex-col gap-2">
                  <div>{{ order()?.shipping_address_data?.line1 }}</div>
                  @if (order()?.shipping_address_data?.line2) {
                    <div>{{ order()?.shipping_address_data?.line2 }}</div>
                  }
                  <div>
                    {{ order()?.shipping_address_data?.city }}, 
                    {{ order()?.shipping_address_data?.state }} 
                    {{ order()?.shipping_address_data?.zip }}
                  </div>
                </div>
              </p-card>
            }
          </div>

          <!-- Sidebar con información adicional -->
          <div>
            <!-- Información de pago -->
            <p-card header="Información de Pago">
              <div class="flex flex-col gap-3">
                <div>
                  <div class="text-sm text-muted-color mb-1">Estado de Pago</div>
                  <p-tag 
                    [value]="getPaymentStatusLabel(order()!.payment_status)" 
                    [severity]="getPaymentStatusSeverity(order()!.payment_status)"
                  />
                </div>
                
                @if (order()!.payment_data) {
                  <div>
                    <div class="text-sm text-muted-color mb-1">Proveedor de Pago</div>
                    <div class="font-semibold">
                      {{ order()?.payment_data?.provider }}
                    </div>
                  </div>
                  
                  @if (order()?.payment_data?.idempotency_key) {
                    <div>
                      <div class="text-sm text-muted-color mb-1">ID de Transacción</div>
                      <div class="font-mono text-sm">
                        {{ order()?.payment_data?.idempotency_key }}
                      </div>
                    </div>
                  }
                }
              </div>
            </p-card>

            <!-- Fechas importantes -->
            <p-card header="Fechas" class="mt-4">
              <div class="flex flex-col gap-3">
                <div>
                  <div class="text-sm text-muted-color mb-1">Fecha de Creación</div>
                  <div>{{ order()!.created_at | date:'dd/MM/yyyy HH:mm' }}</div>
                </div>
                
                @if (order()!.updated_at) {
                  <div>
                    <div class="text-sm text-muted-color mb-1">Última Actualización</div>
                    <div>{{ order()!.updated_at | date:'dd/MM/yyyy HH:mm' }}</div>
                  </div>
                }
              </div>
            </p-card>

            <!-- Notas -->
            @if (order()!.notes) {
              <p-card header="Notas" class="mt-4">
                <p>{{ order()!.notes }}</p>
              </p-card>
            }
          </div>
        </div>
      }

      @if (!loading() && !order()) {
        <div class="text-center py-12">
          <i class="pi pi-exclamation-triangle text-6xl text-muted-color mb-4"></i>
          <p class="text-xl text-muted-color">Pedido no encontrado</p>
          <p-button 
            label="Volver a Pedidos" 
            icon="pi pi-arrow-left"
            (onClick)="goBack()"
            class="mt-4"
          />
        </div>
      }
    </div>
  `
})
export class OrderDetailComponent implements OnInit {
  private ordersService = inject(AdminOrdersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  order = signal<Order | null>(null);
  loading = signal(true);

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadOrder(+id);
    }
  }

  loadOrder(id: number) {
    this.loading.set(true);
    this.ordersService.get(id).subscribe({
      next: (order: Order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading order:', err);
        this.loading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/orders']);
  }

  getStatusLabel(status: string): string {
    const labels: any = {
      'CREATED': 'Creado',
      'PAID': 'Pagado',
      'PROCESSING': 'En Proceso',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): string {
    const severities: any = {
      'CREATED': 'info',
      'PAID': 'success',
      'PROCESSING': 'warning',
      'SHIPPED': 'info',
      'DELIVERED': 'success',
      'CANCELLED': 'danger'
    };
    return severities[status] || 'info';
  }

  getPaymentStatusLabel(status: string): string {
    const labels: any = {
      'PENDING': 'Pendiente',
      'PAID': 'Pagado',
      'FAILED': 'Fallido',
      'REFUNDED': 'Reembolsado'
    };
    return labels[status] || status;
  }

  getPaymentStatusSeverity(status: string): string {
    const severities: any = {
      'PENDING': 'warning',
      'PAID': 'success',
      'FAILED': 'danger',
      'REFUNDED': 'info'
    };
    return severities[status] || 'info';
  }

}

