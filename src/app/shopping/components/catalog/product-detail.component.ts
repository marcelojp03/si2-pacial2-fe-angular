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
    <p-toast />
    
    <div class="surface-ground px-4 py-8 md:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        @if (loading()) {
          <div class="text-center py-12">
            <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
          </div>
        } @else if (product()) {
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Imágenes del producto -->
            <div class="surface-card shadow-md rounded-lg p-6">
              @if (product()!.images && product()!.images!.length > 0) {
                <p-galleria
                  [value]="product()!.images"
                  [responsiveOptions]="responsiveOptions"
                  [containerStyle]="{ 'max-width': '640px' }"
                  [numVisible]="5"
                >
                  <ng-template pTemplate="item" let-item>
                    <img [src]="item.url" [alt]="item.alt_text" class="w-full h-auto" />
                  </ng-template>
                  <ng-template pTemplate="thumbnail" let-item>
                    <img [src]="item.url" [alt]="item.alt_text" class="w-full h-auto" />
                  </ng-template>
                </p-galleria>
              } @else {
                <div class="text-center py-12">
                  <i class="pi pi-image text-6xl text-surface-400"></i>
                  <p class="text-surface-500 mt-4">Sin imágenes</p>
                </div>
              }
            </div>

            <!-- Información del producto -->
            <div>
              <h1 class="text-4xl font-bold text-surface-900 dark:text-surface-0 mb-4">
                {{ product()!.name }}
              </h1>
              
              <div class="text-3xl font-semibold text-primary mb-6">
                @if (product()!.price_range) {
                  @if (product()!.price_range!.min === product()!.price_range!.max) {
                    Bs. {{ product()!.price_range!.min | number:'1.2-2' }}
                  } @else {
                    Bs. {{ product()!.price_range!.min | number:'1.2-2' }} - {{ product()!.price_range!.max | number:'1.2-2' }}
                  }
                }
              </div>

              <p class="text-surface-600 dark:text-surface-400 mb-6">
                {{ product()!.description }}
              </p>

              <button
                pButton
                label="Agregar al carrito"
                icon="pi pi-shopping-cart"
                class="w-full md:w-auto"
                (click)="addToCart()"
              ></button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ProductDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private apiService = inject(ApiService);
  private cartStore = inject(CartStore);
  private messageService = inject(MessageService);

  product = signal<Product | null>(null);
  loading = signal(false);

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
      const mainImage = this.product()!.images?.find(img => img.is_primary)?.url || 
                       this.product()!.images?.[0]?.url ||
                       this.product()!.main_image;
                       
      const price = this.product()!.price_range?.min || 0;
      
      // Usar el primer variant si existe, sino crear uno genérico
      const variantId = this.product()!.variants?.[0]?.id || this.product()!.id;
      
      this.cartStore.addItem({
        variantId: variantId,
        productId: this.product()!.id,
        name: this.product()!.name,
        price: price,
        qty: 1,
        image: mainImage
      });
      
      this.messageService.add({
        severity: 'success',
        summary: 'Producto agregado',
        detail: `${this.product()!.name} se agregó al carrito`
      });
    }
  }
}
