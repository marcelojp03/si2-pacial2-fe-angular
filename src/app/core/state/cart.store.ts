import { computed, Injectable, signal } from '@angular/core';

export interface CartItemLocal {
  variantId: number;
  productId: number;
  name: string;
  price: number;
  qty: number;
  image?: string;
  code?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartStore {
  // Estado reactivo con Signals
  private itemsSignal = signal<CartItemLocal[]>([]);
  
  // Computed values (se recalculan automáticamente)
  items = this.itemsSignal.asReadonly();
  
  totalItems = computed(() => 
    this.itemsSignal().reduce((sum, item) => sum + item.qty, 0)
  );
  
  totalAmount = computed(() => 
    this.itemsSignal().reduce((sum, item) => sum + (item.price * item.qty), 0)
  );

  // ========================================
  // ACTIONS
  // ========================================

  /**
   * Establece todos los items del carrito
   */
  setItems(items: CartItemLocal[]): void {
    this.itemsSignal.set(items);
    this.saveToLocalStorage();
  }

  /**
   * Agrega un item al carrito (si existe, incrementa cantidad)
   */
  addItem(item: CartItemLocal): void {
    const existing = this.itemsSignal().find(i => i.variantId === item.variantId);
    
    if (existing) {
      this.updateQty(item.variantId, existing.qty + item.qty);
    } else {
      this.itemsSignal.update(arr => [...arr, item]);
      this.saveToLocalStorage();
    }
  }

  /**
   * Actualiza la cantidad de un item específico
   */
  updateQty(variantId: number, qty: number): void {
    if (qty <= 0) {
      this.removeItem(variantId);
      return;
    }

    this.itemsSignal.update(arr => 
      arr.map(item => 
        item.variantId === variantId 
          ? { ...item, qty } 
          : item
      )
    );
    this.saveToLocalStorage();
  }

  /**
   * Incrementa la cantidad de un item en 1
   */
  incrementQty(variantId: number): void {
    const item = this.itemsSignal().find(i => i.variantId === variantId);
    if (item) {
      this.updateQty(variantId, item.qty + 1);
    }
  }

  /**
   * Decrementa la cantidad de un item en 1
   */
  decrementQty(variantId: number): void {
    const item = this.itemsSignal().find(i => i.variantId === variantId);
    if (item) {
      this.updateQty(variantId, item.qty - 1);
    }
  }

  /**
   * Elimina un item del carrito
   */
  removeItem(variantId: number): void {
    this.itemsSignal.update(arr => arr.filter(item => item.variantId !== variantId));
    this.saveToLocalStorage();
  }

  /**
   * Vacía completamente el carrito
   */
  clear(): void {
    this.itemsSignal.set([]);
    this.saveToLocalStorage();
  }

  /**
   * Obtiene un item específico
   */
  getItem(variantId: number): CartItemLocal | undefined {
    return this.itemsSignal().find(item => item.variantId === variantId);
  }

  // ========================================
  // LOCAL STORAGE PERSISTENCE
  // ========================================

  private readonly STORAGE_KEY = 'ecommerce_cart';

  /**
   * Guarda el carrito en localStorage
   */
  private saveToLocalStorage(): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.itemsSignal()));
    } catch (e) {
      console.error('Error guardando carrito en localStorage:', e);
    }
  }

  /**
   * Carga el carrito desde localStorage
   */
  loadFromLocalStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const items = JSON.parse(stored) as CartItemLocal[];
        this.itemsSignal.set(items);
      }
    } catch (e) {
      console.error('Error cargando carrito desde localStorage:', e);
      this.itemsSignal.set([]);
    }
  }

  /**
   * Limpia el localStorage del carrito
   */
  clearLocalStorage(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (e) {
      console.error('Error limpiando carrito de localStorage:', e);
    }
  }
}
