import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  private items = signal<CartItem[]>([]);
  
  readonly cartItems = this.items.asReadonly();
  readonly itemCount = computed(() => 
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );
  readonly total = computed(() => 
    this.items().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  addItem(item: Omit<CartItem, 'quantity'>) {
    const existingItem = this.items().find(i => i.product_id === item.product_id);
    
    if (existingItem) {
      this.updateQuantity(item.product_id, existingItem.quantity + 1);
    } else {
      this.items.update(items => [...items, { ...item, quantity: 1 }]);
    }
  }

  removeItem(productId: number) {
    this.items.update(items => items.filter(item => item.product_id !== productId));
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.items.update(items =>
      items.map(item =>
        item.product_id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }

  clearCart() {
    this.items.set([]);
  }
}
