import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';
import { CartService, type Cart, type CartItem } from '../../shopping/components/cart/services/cart.service';
import { MessageService } from 'primeng/api';

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
  private cartService = inject(CartService);
  private messageService = inject(MessageService);
  
  // Estado reactivo con Signals
  private itemsSignal = signal<CartItemLocal[]>([]);
  private cartIdSignal = signal<number | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  
  // Computed values
  items = this.itemsSignal.asReadonly();
  cartId = this.cartIdSignal.asReadonly();
  loading = this.loadingSignal.asReadonly();
  error = this.errorSignal.asReadonly();
  
  totalItems = computed(() => 
    this.itemsSignal().reduce((sum, item) => sum + item.qty, 0)
  );
  
  totalAmount = computed(() => 
    this.itemsSignal().reduce((sum, item) => sum + (item.price * item.qty), 0)
  );

  // ========================================
  // BACKEND INTEGRATION
  // ========================================

  /**
   * Establece el cart_id del backend (llamar después de login)
   */
  setCartId(cartId: number | null): void {
    this.cartIdSignal.set(cartId);
    
    if (cartId) {
      this.saveCartIdToStorage(cartId);
      // Sincronizar items locales con backend antes de cargar
      this.syncLocalItemsToBackend(cartId);
    } else {
      this.clearCartIdFromStorage();
    }
  }

  /**
   * Sincroniza items de localStorage con el backend al hacer login
   */
  private syncLocalItemsToBackend(cartId: number): void {
    const localItems = this.itemsSignal();
    
    if (localItems.length === 0) {
      // No hay items locales, solo cargar desde backend
      this.loadCartFromBackend();
      return;
    }

    console.log(`[CartStore] Sincronizando ${localItems.length} items locales con backend...`);
    this.loadingSignal.set(true);

    // Agregar cada item local al backend secuencialmente
    let syncCount = 0;
    const syncNext = (index: number) => {
      if (index >= localItems.length) {
        // Todos los items sincronizados, cargar carrito actualizado
        console.log(`[CartStore] ${syncCount} items sincronizados con éxito`);
        this.loadCartFromBackend();
        return;
      }

      const item = localItems[index];
      this.cartService.addItem(cartId, {
        variant_id: item.variantId,
        quantity: item.qty
      }).pipe(
        tap(() => {
          syncCount++;
          syncNext(index + 1);
        }),
        catchError(err => {
          console.error(`[CartStore] Error sincronizando item ${item.name}:`, err);
          // Continuar con el siguiente aunque falle uno
          syncNext(index + 1);
          return of(null);
        })
      ).subscribe();
    };

    syncNext(0);
  }

  /**
   * Carga el carrito completo desde el backend
   */
  loadCartFromBackend(): void {
    const cartId = this.cartIdSignal();
    if (!cartId) {
      console.warn('No hay cart_id disponible para cargar desde backend');
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.cartService.getCart(cartId).pipe(
      tap(cart => this.syncBackendCart(cart)),
      catchError(err => {
        this.errorSignal.set('Error cargando carrito');
        console.error('Error cargando carrito desde backend:', err);
        return of(null);
      }),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe();
  }

  /**
   * Sincroniza el estado local con el carrito del backend
   */
  private syncBackendCart(cart: Cart): void {
    const localItems: CartItemLocal[] = cart.items.map(item => ({
      variantId: item.variant.id,
      productId: 0, // El backend no devuelve product_id directamente
      name: item.variant.product_name,
      price: parseFloat(item.price),
      qty: item.quantity,
      code: item.variant.code,
      image: undefined
    }));

    this.itemsSignal.set(localItems);
    this.saveToLocalStorage();
  }

  // ========================================
  // ACTIONS (Con integración backend)
  // ========================================

  /**
   * Agrega un item al carrito (backend o localStorage)
   */
  addItem(item: CartItemLocal): void {
    const cartId = this.cartIdSignal();
    
    // Si hay cart_id, usar backend
    if (cartId) {
      this.addItemToBackend(cartId, item);
    } else {
      // Fallback a localStorage (usuario no logueado)
      this.addItemLocal(item);
    }
  }

  /**
   * Agrega item al backend
   */
  private addItemToBackend(cartId: number, item: CartItemLocal): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.cartService.addItem(cartId, {
      variant_id: item.variantId,
      quantity: item.qty
    }).pipe(
      tap(cart => {
        this.syncBackendCart(cart);
        this.messageService.add({
          severity: 'success',
          summary: 'Producto agregado',
          detail: `${item.name} agregado al carrito`,
          life: 3000
        });
      }),
      catchError(err => {
        this.errorSignal.set('Error agregando producto');
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo agregar el producto al carrito',
          life: 3000
        });
        console.error('Error agregando item al carrito:', err);
        return of(null);
      }),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe();
  }

  /**
   * Agrega item a localStorage (sin backend)
   */
  private addItemLocal(item: CartItemLocal): void {
    const existing = this.itemsSignal().find(i => i.variantId === item.variantId);
    
    if (existing) {
      this.updateQtyLocal(item.variantId, existing.qty + item.qty);
    } else {
      this.itemsSignal.update(arr => [...arr, item]);
      this.saveToLocalStorage();
    }

    this.messageService.add({
      severity: 'success',
      summary: 'Producto agregado',
      detail: `${item.name} agregado al carrito`,
      life: 3000
    });
  }

  /**
   * Actualiza la cantidad de un item
   */
  updateQty(variantId: number, qty: number): void {
    if (qty <= 0) {
      this.removeItem(variantId);
      return;
    }

    const cartId = this.cartIdSignal();
    
    if (cartId) {
      this.updateQtyBackend(variantId, qty);
    } else {
      this.updateQtyLocal(variantId, qty);
    }
  }

  /**
   * Actualiza cantidad en el backend
   */
  private updateQtyBackend(variantId: number, qty: number): void {
    // Encontrar el item_id del backend
    const item = this.itemsSignal().find(i => i.variantId === variantId);
    if (!item) return;

    this.loadingSignal.set(true);

    this.cartService.updateItemQuantity(variantId, qty).pipe(
      tap(() => {
        // Actualizar estado local optimistamente
        this.updateQtyLocal(variantId, qty);
      }),
      catchError(err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo actualizar la cantidad',
          life: 3000
        });
        console.error('Error actualizando cantidad:', err);
        return of(null);
      }),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe();
  }

  /**
   * Actualiza cantidad localmente
   */
  private updateQtyLocal(variantId: number, qty: number): void {
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
   * Incrementa la cantidad en 1
   */
  incrementQty(variantId: number): void {
    const item = this.itemsSignal().find(i => i.variantId === variantId);
    if (item) {
      this.updateQty(variantId, item.qty + 1);
    }
  }

  /**
   * Decrementa la cantidad en 1
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
    const cartId = this.cartIdSignal();
    
    if (cartId) {
      this.removeItemBackend(cartId, variantId);
    } else {
      this.removeItemLocal(variantId);
    }
  }

  /**
   * Elimina item del backend
   */
  private removeItemBackend(cartId: number, variantId: number): void {
    this.loadingSignal.set(true);

    this.cartService.removeItem(cartId, variantId).pipe(
      tap(cart => {
        this.syncBackendCart(cart);
        this.messageService.add({
          severity: 'info',
          summary: 'Producto eliminado',
          detail: 'Producto eliminado del carrito',
          life: 3000
        });
      }),
      catchError(err => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo eliminar el producto',
          life: 3000
        });
        console.error('Error eliminando item:', err);
        return of(null);
      }),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe();
  }

  /**
   * Elimina item localmente
   */
  private removeItemLocal(variantId: number): void {
    this.itemsSignal.update(arr => arr.filter(item => item.variantId !== variantId));
    this.saveToLocalStorage();
  }

  /**
   * Vacía completamente el carrito
   */
  clear(): void {
    const cartId = this.cartIdSignal();
    
    if (cartId) {
      this.clearBackend(cartId);
    } else {
      this.clearLocal();
    }
  }

  /**
   * Vacía carrito en backend
   */
  private clearBackend(cartId: number): void {
    this.loadingSignal.set(true);

    this.cartService.clearCart(cartId).pipe(
      tap(() => {
        this.itemsSignal.set([]);
        this.saveToLocalStorage();
      }),
      catchError(err => {
        console.error('Error limpiando carrito:', err);
        return of(null);
      }),
      finalize(() => this.loadingSignal.set(false))
    ).subscribe();
  }

  /**
   * Vacía carrito localmente
   */
  private clearLocal(): void {
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
  private readonly CART_ID_KEY = 'ecommerce_cart_id';

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
      // Cargar cart_id si existe
      const storedCartId = localStorage.getItem(this.CART_ID_KEY);
      if (storedCartId) {
        this.cartIdSignal.set(parseInt(storedCartId, 10));
      }

      // Cargar items locales
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
      localStorage.removeItem(this.CART_ID_KEY);
    } catch (e) {
      console.error('Error limpiando carrito de localStorage:', e);
    }
  }

  /**
   * Guarda cart_id en localStorage
   */
  private saveCartIdToStorage(cartId: number): void {
    try {
      localStorage.setItem(this.CART_ID_KEY, cartId.toString());
    } catch (e) {
      console.error('Error guardando cart_id:', e);
    }
  }

  /**
   * Elimina cart_id de localStorage
   */
  private clearCartIdFromStorage(): void {
    try {
      localStorage.removeItem(this.CART_ID_KEY);
    } catch (e) {
      console.error('Error limpiando cart_id:', e);
    }
  }
}
