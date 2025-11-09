import { Component, OnInit, signal, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OrdersService } from './services/orders.service';
import type { Order } from './interfaces/order.interface';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    SharedModule,
    RouterLink],
  providers: [MessageService],
  templateUrl: './my-orders.component.html'
})
export class MyOrdersComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private messageService = inject(MessageService);
  
  orders = signal<Order[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadMyOrders();
  }

  loadMyOrders() {
    this.loading.set(true);
    this.ordersService.listOrders().subscribe({
      next: (response: any) => {
        this.orders.set(response.results);
        this.loading.set(false);
      },
      error: (error: any) => {
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

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'PENDING': 'Pendiente',
      'CONFIRMED': 'Confirmado',
      'PROCESSING': 'Procesando',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return labels[status] || status;
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' {
    const severities: Record<string, 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast'> = {
      'PENDING': 'warning',
      'CONFIRMED': 'info',
      'PROCESSING': 'info',
      'SHIPPED': 'info',
      'DELIVERED': 'success',
      'CANCELLED': 'danger'
    };
    return severities[status] || 'secondary';
  }
}
