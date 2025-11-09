import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService } from 'primeng/api';
import { StatsCardComponent, type StatCardConfig } from '../../../shared/components/stats-card.component';
import type { Order } from './interfaces/order.interface';
import { AdminOrdersService } from './services/admin-orders.service';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [
    SharedModule,
    StatsCardComponent
  ],
  providers: [MessageService],
  template: `
    <p-toast />
    
    <div class="grid grid-cols-12 gap-6">
      <!-- Header Card -->
      <div class="col-span-12">
        <div class="card mb-0">
          <div class="flex items-center justify-between">
            <div>
              <h5 class="text-xl font-semibold mb-1">Pedidos de Clientes</h5>
              <p class="text-muted-color text-sm">Gestiona todos los pedidos del sistema</p>
            </div>
            <p-button 
              icon="pi pi-shopping-cart" 
              label="Nueva Compra"
              [rounded]="true"
              (onClick)="goToProducts()"
            />
          </div>
        </div>
      </div>

      <!-- Stats Cards -->
      @for (stat of statsCards(); track stat.label) {
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
          <app-stats-card [config]="stat" />
        </div>
      }

      <!-- Tabla de Pedidos -->
      <div class="col-span-12">
        <div class="card">
          <p-table 
            [value]="orders()" 
            [loading]="loading()"
            [paginator]="true"
            [rows]="10"
            [totalRecords]="totalOrders()"
            [lazy]="true"
            (onLazyLoad)="loadOrders($event)"
            [tableStyle]="{'min-width': '50rem'}"
            styleClass="p-datatable-striped"
            [globalFilterFields]="['order_number']"
          >
            <ng-template pTemplate="caption">
              <div class="flex flex-wrap gap-3 items-center justify-between">
                <div class="flex items-center gap-3">
                  <p-iconfield iconPosition="left">
                    <p-inputicon styleClass="pi pi-search" />
                    <input 
                      pInputText 
                      type="text" 
                      [(ngModel)]="searchQuery"
                      (input)="onSearch()"
                      placeholder="Buscar pedido..." 
                      class="w-full sm:w-auto"
                    />
                  </p-iconfield>
                </div>
                <div class="flex gap-2">
                  <p-button 
                    icon="pi pi-refresh" 
                    [rounded]="true" 
                    [outlined]="true"
                    severity="secondary"
                    (onClick)="loadOrders()"
                    [loading]="loading()"
                  />
                </div>
              </div>
            </ng-template>

            <ng-template pTemplate="header">
              <tr>
                <th>Número de Orden</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th class="text-center">Items</th>
                <th class="text-right">Total</th>
                <th class="text-center">Acciones</th>
              </tr>
            </ng-template>
            
            <ng-template pTemplate="body" let-order>
              <tr>
                <td>
                  <div class="font-semibold">{{ order.order_number }}</div>
                  @if (order.payment_status === 'PAID') {
                    <div class="text-xs text-green-500">
                      <i class="pi pi-check-circle mr-1"></i>
                      Pagado
                    </div>
                  }
                </td>
                <td>
                  {{ order.created_at | date:'dd/MM/yyyy HH:mm' }}
                </td>
                <td>
                  <p-tag 
                    [value]="getStatusLabel(order.status)" 
                    [severity]="getStatusSeverity(order.status)"
                  />
                </td>
                <td class="text-center">
                  {{ order.items?.length || 0 }}
                </td>
                <td class="text-right">
                  <div class="font-bold text-primary">
                    {{ order.currency }} {{ order.total | number:'1.2-2' }}
                  </div>
                </td>
                <td class="text-center">
                  <p-button 
                    icon="pi pi-eye" 
                    [rounded]="true"
                    [text]="true"
                    severity="info"
                    (onClick)="viewOrder(order.id)"
                  />
                </td>
              </tr>
            </ng-template>

            <ng-template pTemplate="emptymessage">
              <tr>
                <td colspan="6" class="text-center py-12">
                  <div class="flex flex-col items-center gap-4">
                    <i class="pi pi-inbox text-6xl text-muted-color"></i>
                    <div>
                      <p class="text-xl font-semibold text-muted-color mb-2">No hay pedidos registrados</p>
                      <p class="text-sm text-muted-color">Los pedidos aparecerán aquí cuando se realicen compras</p>
                    </div>
                    <p-button 
                      label="Ir a comprar" 
                      icon="pi pi-shopping-cart"
                      (onClick)="goToProducts()"
                    />
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
  `
})
export class OrdersListComponent implements OnInit {
  private ordersService = inject(AdminOrdersService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  orders = signal<Order[]>([]);
  loading = signal(false);
  totalOrders = signal(0);
  searchQuery = '';

  // Stats cards computed
  statsCards = computed<StatCardConfig[]>(() => {
    const allOrders = this.orders();
    const totalAmount = allOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const paidOrders = allOrders.filter(o => o.payment_status === 'PAID').length;
    const pendingOrders = allOrders.filter(o => o.status === 'CREATED' || o.status === 'PROCESSING').length;
    const deliveredOrders = allOrders.filter(o => o.status === 'DELIVERED').length;

    return [
      {
        label: 'Total Pedidos',
        value: this.totalOrders().toString(),
        icon: 'pi pi-shopping-bag',
        color: 'blue'
      },
      {
        label: 'Monto Total',
        value: `Bs ${totalAmount.toFixed(2)}`,
        icon: 'pi pi-dollar',
        color: 'green'
      },
      {
        label: 'Pagados',
        value: paidOrders.toString(),
        icon: 'pi pi-check-circle',
        color: 'cyan'
      },
      {
        label: 'En Proceso',
        value: pendingOrders.toString(),
        icon: 'pi pi-clock',
        color: 'orange'
      }
    ];
  });

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders(event?: any) {
    this.loading.set(true);

    const params: any = {
      page: event ? (event.first / event.rows) + 1 : 1,
      page_size: 10
    };

    if (this.searchQuery) {
      params.search = this.searchQuery;
    }

    this.ordersService.list(params).subscribe({
      next: (res: any) => {
        this.orders.set(res.results);
        this.totalOrders.set(res.count);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading orders:', err);
        this.loading.set(false);
        // En caso de error, mostrar array vacío
        this.orders.set([]);
      }
    });
  }

  onSearch() {
    this.loadOrders();
  }

  viewOrder(id: number) {
    this.router.navigate(['/admin/orders', id]);
  }

  goToProducts() {
    this.router.navigate(['/admin/products']);
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
}

