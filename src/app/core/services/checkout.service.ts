import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { 
  CheckoutRequest, 
  CheckoutResponse, 
  ConfirmPaymentRequest, 
  ConfirmPaymentResponse,
  PaymentStatusResponse 
} from '../models/checkout.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.baseUrl}/sales`;

  /**
   * Calcular totales del carrito (subtotal, impuestos, envío, descuento)
   * @param cartId ID del carrito
   * @returns Observable con totales calculados desde el backend
   */
  calculateTotals(cartId: number): Observable<{
    subtotal: number;
    tax: number;
    shipping_cost: number;
    discount: number;
    total: number;
  }> {
    return this.http.get<{
      subtotal: number;
      tax: number;
      shipping_cost: number;
      discount: number;
      total: number;
    }>(`${this.apiUrl}/carts/${cartId}/calculate-totals/`);
  }

  /**
   * Hacer checkout del carrito y crear orden
   * @param cartId ID del carrito
   * @param checkoutData Datos del checkout
   * @returns Observable con orden creada
   */
  checkout(cartId: number, checkoutData: CheckoutRequest): Observable<CheckoutResponse> {
    return this.http.post<CheckoutResponse>(
      `${this.apiUrl}/carts/${cartId}/checkout/`,
      checkoutData
    );
  }

  /**
   * Confirmar pago de una orden (solo para pasarelas reales, no para MOCK/VPAY)
   * @param orderId ID de la orden
   * @param paymentData Datos del pago
   * @returns Observable con confirmación de pago
   */
  confirmPayment(orderId: number, paymentData: ConfirmPaymentRequest): Observable<ConfirmPaymentResponse> {
    return this.http.post<ConfirmPaymentResponse>(
      `${this.apiUrl}/orders/${orderId}/confirm_payment/`,
      paymentData
    );
  }

  /**
   * Verificar estado de pago VPAY (polling)
   * @param orderId ID de la orden
   * @returns Observable con estado del pago
   */
  checkVPayPaymentStatus(orderId: number): Observable<PaymentStatusResponse> {
    return this.http.get<PaymentStatusResponse>(
      `${this.apiUrl}/orders/${orderId}/check-vpay-payment/`
    );
  }

  /**
   * Generar idempotency key único para evitar cargos duplicados
   * @returns String único basado en timestamp y random
   */
  generateIdempotencyKey(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    return `${timestamp}-${random}`;
  }
}
