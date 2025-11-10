import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import type { Order, OrderListItem, OrderFilters, UpdateOrderStatusRequest } from '../interfaces/order.interface';
import type { PaginatedResponse } from '../../../../core/models/api.model';
import type { Order as CoreOrder } from '../../../../core/models/sales.model';

@Injectable({
  providedIn: 'root'
})
export class AdminOrdersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.baseUrl}/sales/orders`;

  /**
   * Lista todos los pedidos con filtros y paginación
   */
  list(filters?: OrderFilters): Observable<PaginatedResponse<OrderListItem>> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<PaginatedResponse<OrderListItem>>(this.apiUrl + '/', { params });
  }

  /**
   * Obtiene un pedido por ID
   */
  get(id: number): Observable<Order> {
    return this.http.get<CoreOrder>(`${this.apiUrl}/${id}/`).pipe(
      map(coreOrder => this.convertToAdminOrder(coreOrder))
    );
  }

  private convertToAdminOrder(coreOrder: CoreOrder): Order {
    return {
      id: coreOrder.id,
      order_number: coreOrder.order_number,
      customer: coreOrder.customer.id,
      customer_name: coreOrder.customer.full_name || `${coreOrder.customer.first_name} ${coreOrder.customer.last_name}`,
      customer_data: {
        id: coreOrder.customer.id,
        full_name: coreOrder.customer.full_name || `${coreOrder.customer.first_name} ${coreOrder.customer.last_name}`,
        email: coreOrder.customer.email
      },
      status: coreOrder.status,
      payment_status: coreOrder.payment_status,
      payment: coreOrder.payment?.id,
      payment_data: coreOrder.payment ? {
        id: coreOrder.payment.id,
        provider: coreOrder.payment.provider,
        status: coreOrder.payment.status,
        idempotency_key: coreOrder.payment.idempotency_key
      } : undefined,
      subtotal: coreOrder.subtotal,
      discount: coreOrder.discount_total,
      shipping_total: coreOrder.shipping_total,
      total: coreOrder.total,
      currency: coreOrder.currency,
      items: coreOrder.items.map(item => ({
        id: item.id,
        product: item.variant.id,
        product_name: item.variant.code, // Usando code como nombre
        variant: item.variant.id,
        variant_name: item.variant.code,
        sku: item.variant.code,
        quantity: item.qty,
        unit_price: item.unit_price,
        subtotal: item.subtotal
      })),
      shipping_address: coreOrder.shipping_address?.id,
      shipping_address_data: coreOrder.shipping_address ? {
        id: coreOrder.shipping_address.id,
        line1: coreOrder.shipping_address.line1,
        line2: coreOrder.shipping_address.line2,
        city: coreOrder.shipping_address.city,
        state: coreOrder.shipping_address.state,
        zip: coreOrder.shipping_address.zip
      } : undefined,
      notes: coreOrder.notes,
      created_at: coreOrder.created_at,
      updated_at: coreOrder.updated_at
    };
  }

  /**
   * Actualiza el estado de un pedido
   */
  updateStatus(id: number, data: UpdateOrderStatusRequest): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/`, data);
  }

  /**
   * Cancela un pedido
   */
  cancel(id: number): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/`, { status: 'CANCELLED' });
  }

  /**
   * Marca un pedido como enviado
   */
  markAsShipped(id: number): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/`, { status: 'SHIPPED' });
  }

  /**
   * Marca un pedido como entregado
   */
  markAsDelivered(id: number): Observable<Order> {
    return this.http.patch<Order>(`${this.apiUrl}/${id}/`, { status: 'DELIVERED' });
  }

  /**
   * Obtiene estadísticas de pedidos
   */
  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats/`);
  }

  /**
   * Exporta pedidos a CSV/Excel
   */
  export(filters?: OrderFilters, format: 'csv' | 'excel' = 'csv'): Observable<Blob> {
    let params = new HttpParams().set('format', format);
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get(`${this.apiUrl}/export/`, { 
      params,
      responseType: 'blob'
    });
  }
}
