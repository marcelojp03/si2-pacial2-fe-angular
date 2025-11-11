import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../core/services/api.service';
import { CartStore } from '../../../core/state/cart.store';
import type { Product } from '../../../core/models';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  template: `
    <div class="min-h-screen bg-surface-50 dark:bg-surface-900">
      <p-toast />
      
      <!-- Breadcrumb -->
      <div class="bg-surface-0 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 px-6 lg:px-20 py-4">
        <div class="max-w-7xl mx-auto">
          <p-button 
            icon="pi pi-arrow-left"
            label="Volver al Catálogo"
            [text]="true"
            (onClick)="goBack()"
          />
        </div>
      </div>

      <div class="px-6 lg:px-20 py-12">
        <div class="max-w-7xl mx-auto">
          @if (loading()) {
            <div class="text-center py-20">
              <p-progressSpinner strokeWidth="3" />
            </div>
          } @else if (product()) {
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <!-- Galería de Imágenes -->
              <div class="lg:sticky lg:top-8 h-fit">
                <div class="surface-card border border-surface-200 dark:border-surface-700 rounded-3xl overflow-hidden shadow-lg">
                  @if (product()!.images && product()!.images!.length > 0) {
                    <p-galleria
                      [value]="product()!.images"
                      [responsiveOptions]="responsiveOptions"
                      [numVisible]="5"
                      [circular]="true"
                      [showItemNavigators]="true"
                      [showThumbnails]="true"
                      [thumbnailsPosition]="'bottom'"
                      styleClass="custom-galleria"
                    >
                      <ng-template pTemplate="item" let-item>
                        <div class="flex items-center justify-center bg-surface-50 dark:bg-surface-800" style="height: 500px;">
                          <img 
                            [src]="item.url" 
                            [alt]="item.alt_text"
                            class="max-w-full max-h-full object-contain"
                          />
                        </div>
                      </ng-template>
                      <ng-template pTemplate="thumbnail" let-item>
                        <div class="p-2">
                          <img 
                            [src]="item.url" 
                            [alt]="item.alt_text"
                            class="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                          />
                        </div>
                      </ng-template>
                    </p-galleria>
                  } @else {
                    <div class="flex items-center justify-center bg-surface-50 dark:bg-surface-800" style="height: 500px;">
                      <div class="text-center">
                        <i class="pi pi-image text-8xl text-surface-400 mb-4 block"></i>
                        <p class="text-xl text-surface-500">Sin imágenes disponibles</p>
                      </div>
                    </div>
                  }
                </div>
              </div>

              <!-- Información del Producto -->
              <div class="space-y-6">
                <!-- Header -->
                <div>
                  @if (product()!.category_names && product()!.category_names!.length > 0) {
                    <div class="flex gap-2 mb-3">
                      @for (category of product()!.category_names; track category) {
                        <p-tag 
                          [value]="category" 
                          severity="info"
                          styleClass="text-xs"
                        />
                      }
                    </div>
                  }
                  
                  <h1 class="text-4xl lg:text-5xl font-bold text-surface-900 dark:text-surface-0 mb-4 leading-tight">
                    {{ product()!.name }}
                  </h1>
                  
                  @if (product()!.brand) {
                    <p class="text-lg text-muted-color mb-2">
                      <span class="font-medium">Marca:</span> {{ product()!.brand }}
                    </p>
                  }
                  
                  @if (product()!.sku) {
                    <p class="text-sm text-muted-color">
                      <span class="font-medium">SKU:</span> {{ product()!.sku }}
                    </p>
                  }
                </div>

                <!-- Precio -->
                <div class="surface-card border-2 border-primary-200 dark:border-primary-800 rounded-2xl p-6">
                  @if (product()!.base_price) {
                    <div class="flex items-baseline gap-3">
                      <span class="text-sm text-muted-color font-medium">Precio:</span>
                      <span class="text-5xl font-bold text-primary-600 dark:text-primary-400">
                        Bs. {{ product()!.base_price | number:'1.2-2' }}
                      </span>
                    </div>
                  }
                  
                  <div class="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                    <div class="flex items-center gap-2">
                      <i class="pi pi-check-circle text-2xl text-green-500"></i>
                      <span class="text-lg font-semibold text-green-600 dark:text-green-400">
                        Disponible en Stock
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Descripción -->
                <div class="surface-card border border-surface-200 dark:border-surface-700 rounded-2xl p-6">
                  <h2 class="text-2xl font-semibold mb-4 text-surface-900 dark:text-surface-0">
                    Descripción del Producto
                  </h2>
                  <p class="text-lg text-surface-600 dark:text-surface-400 leading-relaxed">
                    {{ product()!.description || 'Sin descripción disponible' }}
                  </p>
                </div>

                <!-- Acciones -->
                <div class="space-y-3">
                  <p-button
                    label="Agregar al Carrito"
                    icon="pi pi-shopping-cart"
                    styleClass="w-full"
                    size="large"
                    [raised]="true"
                    (click)="addToCart()"
                    [loading]="addingToCart()"
                  />
                  
                  <div class="grid grid-cols-2 gap-3">
                    <p-button
                      label="Seguir Comprando"
                      icon="pi pi-arrow-left"
                      severity="secondary"
                      [outlined]="true"
                      styleClass="w-full"
                      (click)="goBack()"
                    />
                    <p-button
                      label="Ver Carrito"
                      icon="pi pi-shopping-cart"
                      [badge]="cart.totalItems() > 0 ? cart.totalItems().toString() : ''"
                      severity="success"
                      [outlined]="true"
                      styleClass="w-full"
                      (onClick)="router.navigate(['/cart'])"
                    />
                  </div>
                </div>
              </div>
            </div>
          } @else {
            <div class="text-center py-20">
              <i class="pi pi-exclamation-triangle text-6xl text-orange-500 mb-4 block"></i>
              <h2 class="text-3xl font-semibold mb-3">Producto no encontrado</h2>
              <p class="text-xl text-muted-color mb-6">El producto que buscas no existe o fue eliminado</p>
              <p-button 
                label="Volver al Catálogo"
                icon="pi pi-arrow-left"
                (onClick)="goBack()"
              />
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }

    :host ::ng-deep .custom-galleria {
      .p-galleria-item-container {
        background: transparent;
      }
      
      .p-galleria-thumbnail-container {
        background: var(--surface-0);
        padding: 1rem;
      }
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private apiService = inject(ApiService);
  cart = inject(CartStore);
  private messageService = inject(MessageService);

  product = signal<Product | null>(null);
  loading = signal(false);
  addingToCart = signal(false);

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(+id);
    }
  }

  loadProduct(id: number) {
    this.loading.set(true);
    this.apiService.getProduct(id).subscribe({
      next: (product: Product) => {
        console.log('Product detail response:', product);
        console.log('Product base_price:', product.base_price);
        this.product.set(product);
        this.loading.set(false);
      },
      error: (error: any) => {
        console.error('Error loading product:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el producto'
        });
        this.loading.set(false);
        this.router.navigate(['/products']);
      }
    });
  }

  addToCart() {
    if (this.product()) {
      this.addingToCart.set(true);
      
      const mainImage = this.product()!.images?.find(img => img.is_primary)?.url || 
                       this.product()!.images?.[0]?.url ||
                       this.product()!.main_image;
                       
      const price = parseFloat(this.product()!.base_price) || 0;
      
      // Usar el primer variant si existe, sino crear uno genérico
      const variantId = this.product()!.variants?.[0]?.id || this.product()!.id;
      
      this.cart.addItem({
        variantId: variantId,
        productId: this.product()!.id,
        name: this.product()!.name,
        price: price,
        qty: 1,
        image: mainImage,
        code: this.product()!.sku
      });
      
      this.messageService.add({
        severity: 'success',
        summary: '¡Agregado al Carrito!',
        detail: `${this.product()!.name} se agregó correctamente`,
        life: 3000
      });
      
      setTimeout(() => this.addingToCart.set(false), 500);
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
