import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OrdersService } from '../../../core/services/orders.service';
import { Order, OrderStatus, PaymentStatus, ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from '../../../core/models/orders.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  template: `
    <div class="min-h-screen bg-surface-50 dark:bg-surface-900">
      <p-toast />
      
      <!-- Header -->
      <div class="bg-surface-0 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 py-8 px-6 lg:px-20">
        <div class="max-w-7xl mx-auto">
          <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <p-button 
                icon="pi pi-arrow-left"
                [text]="true"
                size="large"
                (onClick)="goBack()"
              />
              <div>
                <h1 class="text-3xl lg:text-4xl font-bold text-surface-900 dark:text-surface-0">
                  {{ order()?.order_number || 'Cargando...' }}
                </h1>
                <p class="text-muted-color mt-1">{{ order()?.created_at | date:'dd/MM/yyyy HH:mm' }}</p>
              </div>
            </div>
            @if (order()) {
              <div class="flex gap-2">
                <p-tag 
                  [value]="getStatusLabel(order()!.status)" 
                  [severity]="getStatusSeverity(order()!.status)"
                  [icon]="'pi ' + getStatusIcon(order()!.status)"
                  styleClass="text-base px-3 py-2"
                />
                <p-tag 
                  [value]="getPaymentStatusLabel(order()!.payment_status)" 
                  [severity]="getPaymentStatusSeverity(order()!.payment_status)"
                  [icon]="'pi ' + getPaymentStatusIcon(order()!.payment_status)"
                  styleClass="text-base px-3 py-2"
                />
              </div>
            }
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="px-6 lg:px-20 py-8">
        <div class="max-w-7xl mx-auto">
          @if (loading()) {
            <div class="flex flex-col items-center justify-center py-20">
              <p-progressSpinner strokeWidth="4" />
              <p class="text-xl text-muted-color mt-6">Cargando pedido...</p>
            </div>
          }

          @if (!loading() && !order()) {
            <div class="text-center py-20 bg-surface-0 dark:bg-surface-800 rounded-2xl">
              <i class="pi pi-exclamation-triangle text-7xl text-orange-500 mb-6 block"></i>
              <h3 class="text-2xl font-semibold mb-3">Pedido no encontrado</h3>
              <p class="text-lg text-muted-color mb-6">El pedido que buscas no existe o no tienes acceso a él</p>
              <p-button 
                label="Volver a Mis Pedidos"
                icon="pi pi-arrow-left"
                (onClick)="goBack()"
              />
            </div>
          }

          @if (!loading() && order()) {
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <!-- Columna Principal: Productos -->
              <div class="lg:col-span-2 space-y-6">
                <!-- Items del Pedido -->
                <div class="surface-card border border-surface-200 dark:border-surface-700 rounded-2xl p-6">
                  <h2 class="text-2xl font-bold mb-6">Productos del Pedido</h2>
                  
                  @if (order()!.items && order()!.items!.length > 0) {
                    <div class="space-y-4">
                      @for (item of order()!.items; track item.id) {
                        <div class="flex gap-4 p-4 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
                          <div class="flex-1">
                            <h3 class="font-semibold text-lg mb-1">{{ item.product_name }}</h3>
                            @if (item.product_sku) {
                              <p class="text-sm text-muted-color">SKU: {{ item.product_sku }}</p>
                            }
                            @if (item.variant_code) {
                              <p class="text-sm text-muted-color">Variante: {{ item.variant_code }}</p>
                            }
                          </div>
                          
                          <div class="text-right">
                            <p class="text-sm text-muted-color mb-1">Cantidad</p>
                            <p class="font-semibold">{{ item.quantity }}</p>
                          </div>
                          
                          <div class="text-right">
                            <p class="text-sm text-muted-color mb-1">Precio Unit.</p>
                            <p class="font-semibold">Bs. {{ item.unit_price | number:'1.2-2' }}</p>
                          </div>
                          
                          <div class="text-right">
                            <p class="text-sm text-muted-color mb-1">Subtotal</p>
                            <p class="font-bold text-primary-600 dark:text-primary-400">
                              Bs. {{ item.subtotal | number:'1.2-2' }}
                            </p>
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <p class="text-center text-muted-color py-8">No hay productos en este pedido</p>
                  }

                  <!-- Totales -->
                  <div class="mt-8 pt-6 border-t border-surface-200 dark:border-surface-700">
                    <div class="flex flex-col gap-3 max-w-md ml-auto">
                      <div class="flex justify-between text-lg">
                        <span>Subtotal:</span>
                        <span class="font-semibold">Bs. {{ order()!.subtotal | number:'1.2-2' }}</span>
                      </div>
                      
                      @if (order()!.discount && +order()!.discount > 0) {
                        <div class="flex justify-between text-green-600">
                          <span>Descuento:</span>
                          <span class="font-semibold">-Bs. {{ order()!.discount | number:'1.2-2' }}</span>
                        </div>
                      }
                      
                      @if (order()!.tax && +order()!.tax > 0) {
                        <div class="flex justify-between">
                          <span>IVA:</span>
                          <span class="font-semibold">Bs. {{ order()!.tax | number:'1.2-2' }}</span>
                        </div>
                      }
                      
                      @if (order()!.shipping_cost && +order()!.shipping_cost > 0) {
                        <div class="flex justify-between">
                          <span>Envío:</span>
                          <span class="font-semibold">Bs. {{ order()!.shipping_cost | number:'1.2-2' }}</span>
                        </div>
                      }
                      
                      <div class="border-t border-surface-200 dark:border-surface-700 pt-3 mt-2"></div>
                      
                      <div class="flex justify-between text-2xl">
                        <span class="font-bold">Total:</span>
                        <span class="font-bold text-primary-600 dark:text-primary-400">
                          Bs. {{ order()!.total | number:'1.2-2' }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Direcciones -->
                @if (order()!.shipping_address || order()!.billing_address) {
                  <div class="surface-card border border-surface-200 dark:border-surface-700 rounded-2xl p-6">
                    <h2 class="text-2xl font-bold mb-6">Información de Envío y Facturación</h2>
                    
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                      @if (order()!.shipping_address) {
                        <div>
                          <h3 class="font-semibold text-lg mb-3 flex items-center gap-2">
                            <i class="pi pi-map-marker text-primary-500"></i>
                            Dirección de Envío
                          </h3>
                          <div class="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                            <p class="whitespace-pre-line">{{ order()!.shipping_address }}</p>
                          </div>
                        </div>
                      }
                      
                      @if (order()!.billing_address) {
                        <div>
                          <h3 class="font-semibold text-lg mb-3 flex items-center gap-2">
                            <i class="pi pi-file text-primary-500"></i>
                            Dirección de Facturación
                          </h3>
                          <div class="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg">
                            <p class="whitespace-pre-line">{{ order()!.billing_address }}</p>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                }

                <!-- Notas -->
                @if (order()!.notes) {
                  <div class="surface-card border border-surface-200 dark:border-surface-700 rounded-2xl p-6">
                    <h2 class="text-2xl font-bold mb-4 flex items-center gap-2">
                      <i class="pi pi-comment text-primary-500"></i>
                      Notas del Pedido
                    </h2>
                    <p class="text-muted-color">{{ order()!.notes }}</p>
                  </div>
                }
              </div>

              <!-- Sidebar: Información Adicional -->
              <div class="space-y-6">
                <!-- Estado y Fechas -->
                <div class="surface-card border border-surface-200 dark:border-surface-700 rounded-2xl p-6">
                  <h3 class="text-xl font-bold mb-4">Estado del Pedido</h3>
                  
                  <div class="space-y-4">
                    <div>
                      <p class="text-sm text-muted-color mb-2">Estado Actual</p>
                      <p-tag 
                        [value]="getStatusLabel(order()!.status)" 
                        [severity]="getStatusSeverity(order()!.status)"
                        [icon]="'pi ' + getStatusIcon(order()!.status)"
                        styleClass="text-base w-full justify-center"
                      />
                    </div>
                    
                    <div>
                      <p class="text-sm text-muted-color mb-2">Estado de Pago</p>
                      <p-tag 
                        [value]="getPaymentStatusLabel(order()!.payment_status)" 
                        [severity]="getPaymentStatusSeverity(order()!.payment_status)"
                        [icon]="'pi ' + getPaymentStatusIcon(order()!.payment_status)"
                        styleClass="text-base w-full justify-center"
                      />
                    </div>
                    
                    @if (order()!.payment_method) {
                      <div>
                        <p class="text-sm text-muted-color mb-2">Método de Pago</p>
                        <p class="font-semibold">{{ order()!.payment_method }}</p>
                      </div>
                    }
                  </div>
                </div>

                <!-- Timeline de Fechas -->
                <div class="surface-card border border-surface-200 dark:border-surface-700 rounded-2xl p-6">
                  <h3 class="text-xl font-bold mb-4">Historial</h3>
                  
                  <div class="space-y-4">
                    <div class="flex items-start gap-3">
                      <i class="pi pi-check-circle text-green-500 text-xl mt-1"></i>
                      <div class="flex-1">
                        <p class="font-semibold">Pedido Creado</p>
                        <p class="text-sm text-muted-color">
                          {{ order()!.created_at | date:'dd/MM/yyyy HH:mm' }}
                        </p>
                      </div>
                    </div>
                    
                    @if (order()!.paid_at) {
                      <div class="flex items-start gap-3">
                        <i class="pi pi-money-bill text-green-500 text-xl mt-1"></i>
                        <div class="flex-1">
                          <p class="font-semibold">Pago Confirmado</p>
                          <p class="text-sm text-muted-color">
                            {{ order()!.paid_at | date:'dd/MM/yyyy HH:mm' }}
                          </p>
                        </div>
                      </div>
                    }
                    
                    @if (order()!.shipped_at) {
                      <div class="flex items-start gap-3">
                        <i class="pi pi-send text-blue-500 text-xl mt-1"></i>
                        <div class="flex-1">
                          <p class="font-semibold">Pedido Enviado</p>
                          <p class="text-sm text-muted-color">
                            {{ order()!.shipped_at | date:'dd/MM/yyyy HH:mm' }}
                          </p>
                        </div>
                      </div>
                    }
                    
                    @if (order()!.delivered_at) {
                      <div class="flex items-start gap-3">
                        <i class="pi pi-check text-green-500 text-xl mt-1"></i>
                        <div class="flex-1">
                          <p class="font-semibold">Pedido Entregado</p>
                          <p class="text-sm text-muted-color">
                            {{ order()!.delivered_at | date:'dd/MM/yyyy HH:mm' }}
                          </p>
                        </div>
                      </div>
                    }
                    
                    @if (order()!.cancelled_at) {
                      <div class="flex items-start gap-3">
                        <i class="pi pi-times-circle text-red-500 text-xl mt-1"></i>
                        <div class="flex-1">
                          <p class="font-semibold">Pedido Cancelado</p>
                          <p class="text-sm text-muted-color">
                            {{ order()!.cancelled_at | date:'dd/MM/yyyy HH:mm' }}
                          </p>
                        </div>
                      </div>
                    }
                  </div>
                </div>

                <!-- Acciones -->
                <div class="surface-card border border-surface-200 dark:border-surface-700 rounded-2xl p-6">
                  <h3 class="text-xl font-bold mb-4">Acciones</h3>
                  <div class="flex flex-col gap-3">
                    <p-button 
                      label="Volver a Mis Pedidos"
                      icon="pi pi-arrow-left"
                      [outlined]="true"
                      styleClass="w-full"
                      (onClick)="goBack()"
                    />
                    <p-button 
                      label="Contactar Soporte"
                      icon="pi pi-question-circle"
                      severity="secondary"
                      [outlined]="true"
                      styleClass="w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class OrderDetailComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private messageService = inject(MessageService);

  order = signal<Order | null>(null);
  loading = signal(true);

  // Mapeos
  ORDER_STATUS_MAP = ORDER_STATUS_MAP;
  PAYMENT_STATUS_MAP = PAYMENT_STATUS_MAP;

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.loadOrder(+id);
    }
  }

  loadOrder(id: number) {
    this.loading.set(true);
    this.ordersService.getOrderById(id).subscribe({
      next: (order: Order) => {
        this.order.set(order);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading order:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el pedido'
        });
        this.loading.set(false);
      }
    });
  }

  goBack() {
    this.router.navigate(['/my-orders']);
  }

  getStatusLabel(status: OrderStatus): string {
    return this.ORDER_STATUS_MAP[status]?.label || status;
  }

  getStatusSeverity(status: OrderStatus): any {
    return this.ORDER_STATUS_MAP[status]?.severity || 'info';
  }

  getStatusIcon(status: OrderStatus): string {
    return this.ORDER_STATUS_MAP[status]?.icon || 'pi-circle';
  }

  getPaymentStatusLabel(status: PaymentStatus): string {
    return this.PAYMENT_STATUS_MAP[status]?.label || status;
  }

  getPaymentStatusSeverity(status: PaymentStatus): any {
    return this.PAYMENT_STATUS_MAP[status]?.severity || 'info';
  }

  getPaymentStatusIcon(status: PaymentStatus): string {
    return this.PAYMENT_STATUS_MAP[status]?.icon || 'pi-circle';
  }
}
