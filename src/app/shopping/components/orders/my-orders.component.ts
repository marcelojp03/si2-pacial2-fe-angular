import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { OrdersService } from '../../../core/services/orders.service';
import { AuthService } from '../../../core/services/auth.service';
import { MessageService } from 'primeng/api';
import { Order, OrderStatus, PaymentStatus, ORDER_STATUS_MAP, PAYMENT_STATUS_MAP } from '../../../core/models/orders.model';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: './my-orders.component.html'
})
export class MyOrdersComponent implements OnInit {
  router = inject(Router);
  private ordersService = inject(OrdersService);
  private authService = inject(AuthService);
  private messageService = inject(MessageService);

  orders = signal<Order[]>([]);
  loading = signal(false);
  totalOrders = signal(0);
  currentPage = 1;
  pageSize = 10;
  
  selectedStatus: OrderStatus | null = null;
  selectedPaymentStatus: PaymentStatus | null = null;
  searchQuery = '';
  
  cancellingOrderId = signal<number | null>(null);
  showCancelDialog = false;
  orderToCancel: Order | null = null;

  // Mapeos importados
  ORDER_STATUS_MAP = ORDER_STATUS_MAP;
  PAYMENT_STATUS_MAP = PAYMENT_STATUS_MAP;

  statusOptions = [
    { label: 'Creado', value: 'CREATED' },
    { label: 'Confirmado', value: 'CONFIRMED' },
    { label: 'En Proceso', value: 'PROCESSING' },
    { label: 'Enviado', value: 'SHIPPED' },
    { label: 'Entregado', value: 'DELIVERED' },
    { label: 'Cancelado', value: 'CANCELLED' }
  ];

  paymentStatusOptions = [
    { label: 'Pendiente', value: 'PENDING' },
    { label: 'Pagado', value: 'PAID' },
    { label: 'Fallido', value: 'FAILED' },
    { label: 'Reembolsado', value: 'REFUNDED' }
  ];

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/auth/login']);
      return;
    }

    const customerId = parseInt(localStorage.getItem('customer_id') || '0');
    if (!customerId) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo obtener la información del cliente'
      });
      return;
    }

    this.loading.set(true);

    const filters = {
      status: this.selectedStatus || undefined,
      payment_status: this.selectedPaymentStatus || undefined,
      search: this.searchQuery || undefined
    };

    this.ordersService.getOrders(customerId, filters).subscribe({
      next: (response) => {
        this.orders.set(response.results || []);
        this.totalOrders.set(response.count || 0);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los pedidos'
        });
        this.loading.set(false);
      }
    });
  }

  onFilterChange() {
    this.currentPage = 1;
    this.loadOrders();
  }

  onSearchChange() {
    this.currentPage = 1;
    this.loadOrders();
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1;
    this.loadOrders();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  viewOrder(orderId: number) {
    this.router.navigate(['/my-orders', orderId]);
  }

  canCancelOrder(order: Order): boolean {
    return order.status === 'CREATED' || order.status === 'CONFIRMED';
  }

  confirmCancelOrder(order: Order) {
    this.orderToCancel = order;
    this.showCancelDialog = true;
  }

  cancelOrder() {
    if (!this.orderToCancel) return;

    this.cancellingOrderId.set(this.orderToCancel.id);

    this.ordersService.cancelOrder(this.orderToCancel.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Pedido Cancelado',
          detail: `El pedido ${this.orderToCancel?.order_number} ha sido cancelado`
        });
        this.showCancelDialog = false;
        this.orderToCancel = null;
        this.cancellingOrderId.set(null);
        this.loadOrders();
      },
      error: (error) => {
        console.error('Error cancelling order:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.detail || 'No se pudo cancelar el pedido'
        });
        this.cancellingOrderId.set(null);
      }
    });
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

  getPaymentLabel(status: PaymentStatus): string {
    return this.PAYMENT_STATUS_MAP[status]?.label || status;
  }

  getPaymentSeverity(status: PaymentStatus): any {
    return this.PAYMENT_STATUS_MAP[status]?.severity || 'info';
  }

  getPaymentIcon(status: PaymentStatus): string {
    return this.PAYMENT_STATUS_MAP[status]?.icon || 'pi-circle';
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
