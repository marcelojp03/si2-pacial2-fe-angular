import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Order, OrderFilters } from '../models/orders.model';
import type { PaginatedResponse } from '../models/api.model';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.baseUrl}/sales`;

  /**
   * Obtener todos los pedidos del cliente autenticado
   * @param customerId ID del cliente
   * @param filters Filtros opcionales (estado, fecha, etc.)
   * @returns Observable con lista paginada de pedidos
   */
  getOrders(customerId: number, filters?: OrderFilters): Observable<PaginatedResponse<Order>> {
    let params = new HttpParams().set('customer', customerId.toString());

    if (filters?.status) {
      params = params.set('status', filters.status);
    }
    if (filters?.payment_status) {
      params = params.set('payment_status', filters.payment_status);
    }
    if (filters?.date_from) {
      params = params.set('date_from', filters.date_from);
    }
    if (filters?.date_to) {
      params = params.set('date_to', filters.date_to);
    }
    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    return this.http.get<PaginatedResponse<Order>>(`${this.apiUrl}/orders/`, { params });
  }

  /**
   * Obtener detalle de un pedido específico
   * @param orderId ID del pedido
   * @returns Observable con detalles del pedido incluyendo items
   */
  getOrderById(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}/`);
  }

  /**
   * Cancelar un pedido
   * @param orderId ID del pedido a cancelar
   * @returns Observable con el pedido cancelado
   */
  cancelOrder(orderId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/orders/${orderId}/cancel/`, {});
  }

  /**
   * Obtener estadísticas de pedidos del cliente
   * @param customerId ID del cliente
   * @returns Observable con estadísticas
   */
  getOrderStats(customerId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders/stats/`, {
      params: { customer: customerId.toString() }
    });
  }
}
