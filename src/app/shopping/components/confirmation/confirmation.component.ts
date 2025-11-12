import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { SharedModule } from '../../../shared/shared.module';
import type { CheckoutResponse } from '../../../core/models/checkout.model';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers: [MessageService],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  order = signal<CheckoutResponse | null>(null);
  loading = signal(true);

  // Helpers para template
  parseFloat = parseFloat;

  ngOnInit(): void {
    // Intentar obtener orden del state (cuando viene desde checkout)
    const navigation = this.router.getCurrentNavigation();
    const orderFromState = navigation?.extras?.state?.['order'] as CheckoutResponse;
    
    if (orderFromState) {
      console.log('[OrderSuccess] Orden recibida del checkout:', orderFromState);
      this.order.set(orderFromState);
      this.loading.set(false);
      return;
    }

    // Si no hay orden en state, mostrar error
    console.error('[OrderSuccess] No order data provided');
    this.loading.set(false);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  goToOrders(): void {
    this.router.navigate(['/shopping/my-orders']);
  }

  goToShop(): void {
    this.router.navigate(['/shopping/products']);
  }
}

