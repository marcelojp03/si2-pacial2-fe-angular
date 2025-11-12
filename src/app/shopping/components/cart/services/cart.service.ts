import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../../../core/services/api.service';
import { environment } from '../../../../../environments/environment';
import type { CheckoutData, CheckoutResponse } from '../interfaces/cart.interface';

export interface CartItem {
  id: number;
  cart: number;
  variant: number;  // ✅ ID de la variante (no es un objeto)
  variant_code: string;
  product_name: string;
  product_image: string | null;
  variant_price: string;
  quantity: number;
  price: string;
  subtotal: string;
  added_at: string;
}

export interface Cart {
  id: number;
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  items: CartItem[];
  total_items: number;
  subtotal: string;
  created_at: string;
  updated_at: string;
}

export interface AddItemRequest {
  variant_id: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private api = inject(ApiService);
  private http = inject(HttpClient);
  private baseUrl = `${environment.api.baseUrl}/sales/carts`;

  /**
   * Obtiene el carrito completo
   */
  getCart(cartId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/${cartId}/`);
  }

  /**
   * Agrega un item al carrito (o incrementa cantidad si ya existe)
   */
  addItem(cartId: number, data: AddItemRequest): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/${cartId}/add_item/`, data);
  }

  /**
   * Actualiza la cantidad de un item específico
   */
  updateItemQuantity(itemId: number, quantity: number): Observable<CartItem> {
    return this.http.patch<CartItem>(`${environment.api.baseUrl}/sales/cart-items/${itemId}/`, { quantity });
  }

  /**
   * Elimina un item del carrito
   */
  removeItem(cartId: number, itemId: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/${cartId}/remove-item/${itemId}/`, {});
  }

  /**
   * Vacía el carrito completamente
   */
  clearCart(cartId: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/${cartId}/clear/`, {});
  }

  /**
   * Checkout - Crea la orden desde el carrito
   * Reserva el stock y vacía el carrito
   */
  checkout(cartId: number, data: CheckoutData): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(`${this.baseUrl}/${cartId}/checkout/`, data);
  }

  /**
   * Confirma el pago de una orden (después de pagar con Stripe/PayPal)
   * Deduce el stock y marca la orden como pagada
   */
  confirmPayment(orderId: number, paymentData: any): Observable<any> {
    return this.http.post(`${environment.api.baseUrl}/sales/orders/${orderId}/confirm_payment/`, paymentData);
  }
}
