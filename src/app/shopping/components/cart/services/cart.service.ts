import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import type { CheckoutData, CheckoutResponse } from '../interfaces/cart.interface';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private api = inject(ApiService);

  checkout(data: CheckoutData): Observable<CheckoutResponse> {
    return this.api.checkout(data) as Observable<CheckoutResponse>;
  }

  confirmPayment(orderId: number, paymentData: any): Observable<any> {
    return this.api.confirmPayment(orderId, paymentData);
  }
}
