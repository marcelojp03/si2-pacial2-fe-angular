import { Component, inject, OnInit } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { CartStore } from '../../../core/state/cart.store';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.scss'
})
export class CartPageComponent implements OnInit {
  cart = inject(CartStore);
  private router = inject(Router);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.cart.loadFromLocalStorage();
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  goToCheckout() {
    console.log('[CartPage] goToCheckout() called');
    console.log('[CartPage] Cart items:', this.cart.items().length);
    
    if (this.cart.items().length === 0) {
      console.warn('[CartPage] Cart is empty, showing warning');
      this.messageService.add({
        severity: 'warn',
        summary: 'Carrito vacío',
        detail: 'Agrega productos antes de continuar'
      });
      return;
    }
    
    console.log('[CartPage] Navigating to /checkout');
    this.router.navigate(['/checkout']).then(
      success => console.log('[CartPage] Navigation success:', success),
      error => console.error('[CartPage] Navigation error:', error)
    );
  }

  removeItem(variantId: number, productName: string) {
    this.cart.removeItem(variantId);
    this.messageService.add({
      severity: 'info',
      summary: 'Producto eliminado',
      detail: `${productName} se eliminó del carrito`
    });
  }

  clearCart() {
    if (confirm('¿Estás seguro de vaciar el carrito?')) {
      this.cart.clear();
      this.messageService.add({
        severity: 'info',
        summary: 'Carrito vaciado',
        detail: 'Se eliminaron todos los productos'
      });
    }
  }
}
