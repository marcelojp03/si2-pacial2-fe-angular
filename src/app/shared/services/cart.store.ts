import { Injectable, signal, computed, effect } from '@angular/core';

export interface CartItem {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  variant_id?: number;
  sku?: string;
}

const CART_STORAGE_KEY = 'shopping_cart';

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

  constructor() {
    // Auto-save to localStorage on changes
    effect(() => {
      const cartData = this.items();
      if (cartData.length > 0) {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
      } else {
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    });

    // Load from localStorage on init
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        this.items.set(parsed);
      } catch (error) {
        console.error('Error loading cart from storage:', error);
      }
    }
  }

  addItem(item: Omit<CartItem, 'quantity'>, quantity: number = 1) {
    const existingItem = this.items().find(i => i.product_id === item.product_id);
    
    if (existingItem) {
      this.updateQuantity(item.product_id, existingItem.quantity + quantity);
    } else {
      this.items.update(items => [...items, { ...item, quantity }]);
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

  incrementQuantity(productId: number) {
    const item = this.items().find(i => i.product_id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decrementQuantity(productId: number) {
    const item = this.items().find(i => i.product_id === productId);
    if (item && item.quantity > 1) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  clearCart() {
    this.items.set([]);
  }

  getItem(productId: number): CartItem | undefined {
    return this.items().find(i => i.product_id === productId);
  }
}
