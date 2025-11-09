import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import type { Order as ShoppingOrder, OrderListItem } from '../interfaces/order.interface';
import type { Order as CoreOrder } from '../../../../core/models/sales.model';
import type { PaginatedResponse } from '../../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private api = inject(ApiService);

  /**
   * Lista las órdenes - convierte de CoreOrder a ShoppingOrder
   */
  listOrders(params?: any): Observable<PaginatedResponse<ShoppingOrder>> {
    return this.api.listOrders(params).pipe(
      map((response: any) => ({
        ...response,
        results: response.results.map((order: CoreOrder) => this.convertOrder(order))
      }))
    );
  }

  /**
   * Obtiene una orden específica - convierte de CoreOrder a ShoppingOrder
   */
  getOrder(id: number): Observable<ShoppingOrder> {
    return this.api.getOrder(id).pipe(
      map((order: CoreOrder) => this.convertOrder(order))
    );
  }

  /**
   * Actualiza el estado de una orden
   */
  updateOrderStatus(id: number, status: string): Observable<any> {
    // El ApiService no tiene updateOrder, hacer request directo
    return this.api['http'].patch(`/sales/orders/${id}/`, { status });
  }

  /**
   * Cancela una orden
   */
  cancelOrder(id: number): Observable<any> {
    return this.api['http'].patch(`/sales/orders/${id}/`, { status: 'CANCELLED' });
  }

  /**
   * Convierte Order de core a Order de shopping
   */
  private convertOrder(coreOrder: CoreOrder): ShoppingOrder {
    return {
      id: coreOrder.id,
      order_number: coreOrder.order_number,
      customer: coreOrder.customer.id,
      customer_name: coreOrder.customer.full_name,
      status: coreOrder.status,
      payment_status: coreOrder.payment_status,
      payment_method: coreOrder.payment?.provider as any,
      payment_id: coreOrder.payment?.idempotency_key,
      payment: coreOrder.payment?.id,
      subtotal: coreOrder.subtotal,
      discount: coreOrder.discount_total,
      tax: 0, // No existe en CoreOrder
      shipping_cost: coreOrder.shipping_total,
      shipping_total: coreOrder.shipping_total,
      total: coreOrder.total,
      currency: coreOrder.currency,
      items: coreOrder.items.map(item => ({
        id: item.id,
        product: item.variant.id,
        product_name: item.variant.code, // Usar code como fallback
        variant: item.variant.id,
        variant_name: item.variant.code,
        sku: item.variant.code,
        quantity: item.qty,
        unit_price: item.unit_price,
        subtotal: item.subtotal
      })),
      shipping_address: coreOrder.shipping_address ? {
        full_name: '',
        street_address: coreOrder.shipping_address.line1,
        apartment: coreOrder.shipping_address.line2,
        city: coreOrder.shipping_address.city,
        state: coreOrder.shipping_address.state,
        zip_code: coreOrder.shipping_address.zip,
        country: 'Bolivia',
        phone: ''
      } : undefined,
      billing_address: undefined,
      notes: coreOrder.notes,
      created_at: coreOrder.created_at,
      updated_at: coreOrder.updated_at,
      confirmed_at: undefined,
      shipped_at: undefined,
      delivered_at: undefined
    };
  }
}
