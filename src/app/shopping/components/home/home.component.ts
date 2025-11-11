import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ApiService } from '../../../core/services/api.service';
import { CartStore } from '../../../core/state/cart.store';
import type { ProductListItem, Category } from '../../../core/models';

@Component({
  selector: 'app-shopping-home',
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  template: `
    <div class="px-6 lg:px-20 py-8">
      <p-toast />
      
      <!-- Hero Section -->
      <div class="text-center mb-12">
        <h1 class="text-5xl font-bold mb-4 text-surface-900 dark:text-surface-0">
          Bienvenido a Nuestra Tienda
        </h1>
        <p class="text-xl text-muted-color mb-6">
          Descubre nuestros productos de calidad al mejor precio
        </p>
        
        <!-- Carrito -->
        <div class="flex justify-center gap-4">
          <p-button 
            label="Ver Catálogo Completo"
            icon="pi pi-shopping-bag"
            size="large"
            (onClick)="router.navigate(['/products'])"
          />
          <p-button 
            icon="pi pi-shopping-cart"
            [badge]="cart.totalItems().toString()"
            [outlined]="true"
            severity="success"
            size="large"
            (onClick)="router.navigate(['/cart'])"
          />
        </div>
      </div>

      <!-- Categorías -->
      @if (categories().length > 0) {
        <div class="mb-12">
          <h2 class="text-3xl font-semibold mb-6 text-center">Categorías</h2>
          <div class="flex gap-3 justify-center flex-wrap">
            @for (category of categories(); track category.id) {
              <p-button 
                [label]="category.name"
                [outlined]="true"
                (onClick)="filterByCategory(category.id)"
              />
            }
          </div>
        </div>
      }

      <!-- Productos Destacados -->
      @if (featuredProducts().length > 0) {
        <div class="mb-12">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-3xl font-semibold">Productos Destacados</h2>
            <p-button 
              label="Ver todos"
              icon="pi pi-arrow-right"
              [text]="true"
              iconPos="right"
              (onClick)="router.navigate(['/products'])"
            />
          </div>

          <div class="grid">
            @for (product of featuredProducts(); track product.id) {
              <div class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
                <div class="border-surface-200 dark:border-surface-700 surface-card rounded-xl border p-4 hover:shadow-lg transition-all">
                  <!-- Imagen -->
                  <div class="relative mb-3">
                    @if (product.main_image) {
                      <img 
                        [src]="product.main_image" 
                        [alt]="product.name"
                        class="w-full h-48 object-cover rounded-xl cursor-pointer"
                        (click)="viewProduct(product.id)"
                      />
                    } @else {
                      <div class="w-full h-48 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center cursor-pointer"
                           (click)="viewProduct(product.id)">
                        <i class="pi pi-image text-4xl text-muted-color"></i>
                      </div>
                    }
                    <p-tag 
                      value="Destacado" 
                      severity="success"
                      icon="pi pi-star"
                      class="absolute top-2 right-2"
                    />
                  </div>

                  <!-- Info -->
                  <div class="mb-3">
                    <h4 class="text-lg font-semibold mb-2 truncate cursor-pointer hover:text-primary"
                        (click)="viewProduct(product.id)">
                      {{ product.name }}
                    </h4>
                    <p class="text-sm text-muted-color line-clamp-2 mb-2">
                      {{ product.description || 'Sin descripción' }}
                    </p>
                    @if (product.price_range) {
                      <div class="text-xl font-bold text-primary">
                        @if (product.price_range.min === product.price_range.max) {
                          Bs. {{ product.price_range.min | number:'1.2-2' }}
                        } @else {
                          Bs. {{ product.price_range.min | number:'1.2-2' }} - {{ product.price_range.max | number:'1.2-2' }}
                        }
                      </div>
                    }
                  </div>

                  <!-- Acciones -->
                  <div class="flex gap-2">
                    <p-button 
                      label="Ver" 
                      icon="pi pi-eye"
                      [outlined]="true"
                      size="small"
                      class="flex-1"
                      (onClick)="viewProduct(product.id)"
                    />
                    <p-button 
                      icon="pi pi-shopping-cart"
                      severity="success"
                      size="small"
                      (onClick)="addToCart(product)"
                      [loading]="addingToCart() === product.id"
                    />
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Últimos Productos -->
      @if (recentProducts().length > 0) {
        <div>
          <h2 class="text-3xl font-semibold mb-6">Últimos Productos</h2>
          <div class="grid">
            @for (product of recentProducts(); track product.id) {
              <div class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
                <div class="border-surface-200 dark:border-surface-700 surface-card rounded-xl border p-4 hover:shadow-lg transition-all">
                  <div class="relative mb-3">
                    @if (product.main_image) {
                      <img 
                        [src]="product.main_image" 
                        [alt]="product.name"
                        class="w-full h-48 object-cover rounded-xl cursor-pointer"
                        (click)="viewProduct(product.id)"
                      />
                    } @else {
                      <div class="w-full h-48 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center cursor-pointer"
                           (click)="viewProduct(product.id)">
                        <i class="pi pi-image text-4xl text-muted-color"></i>
                      </div>
                    }
                  </div>
                  <div class="mb-3">
                    <h4 class="text-lg font-semibold mb-2 truncate cursor-pointer hover:text-primary"
                        (click)="viewProduct(product.id)">
                      {{ product.name }}
                    </h4>
                    @if (product.price_range) {
                      <div class="text-xl font-bold text-primary">
                        Bs. {{ product.price_range.min | number:'1.2-2' }}
                      </div>
                    }
                  </div>
                  <div class="flex gap-2">
                    <p-button 
                      label="Ver" 
                      [outlined]="true"
                      size="small"
                      class="flex-1"
                      (onClick)="viewProduct(product.id)"
                    />
                    <p-button 
                      icon="pi pi-shopping-cart"
                      severity="success"
                      size="small"
                      (onClick)="addToCart(product)"
                    />
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      }

      @if (loading()) {
        <div class="text-center py-12">
          <p-progressSpinner />
        </div>
      }
    </div>
  `,
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class ShoppingHomeComponent implements OnInit {
  private api = inject(ApiService);
  cart = inject(CartStore);
  router = inject(Router);
  private messageService = inject(MessageService);

  featuredProducts = signal<ProductListItem[]>([]);
  recentProducts = signal<ProductListItem[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  addingToCart = signal<number | null>(null);

  ngOnInit() {
    this.loadCategories();
    this.loadFeaturedProducts();
    this.loadRecentProducts();
    this.cart.loadFromLocalStorage();
  }

  loadCategories() {
    this.api.listCategories().subscribe({
      next: (res: any) => this.categories.set(res.results || []),
      error: (err: any) => console.error('Error loading categories:', err)
    });
  }

  loadFeaturedProducts() {
    this.loading.set(true);
    this.api.listProducts({ featured: true, page_size: 8 }).subscribe({
      next: (res: any) => {
        this.featuredProducts.set(res.results || []);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading featured products:', err);
        this.loading.set(false);
      }
    });
  }

  loadRecentProducts() {
    this.api.listProducts({ page_size: 8 }).subscribe({
      next: (res: any) => this.recentProducts.set(res.results || []),
      error: (err: any) => console.error('Error loading recent products:', err)
    });
  }

  filterByCategory(categoryId: number) {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }

  viewProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  addToCart(product: ProductListItem) {
    this.addingToCart.set(product.id);
    this.cart.addItem({
      variantId: product.id,
      productId: product.id,
      name: product.name,
      price: product.price_range?.min || 0,
      qty: 1,
      image: product.main_image,
      code: product.slug
    });
    this.messageService.add({
      severity: 'success',
      summary: '¡Agregado!',
      detail: `${product.name} se agregó al carrito`,
      life: 3000
    });
    setTimeout(() => this.addingToCart.set(null), 500);
  }
}
