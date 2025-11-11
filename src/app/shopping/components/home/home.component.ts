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
    <div class="min-h-screen bg-gray-50">
      <p-toast />
      
      <!-- Hero Section -->
      <div class="relative bg-surface-0 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700">
        <div class="relative px-6 lg:px-20 py-20 lg:py-28">
          <div class="max-w-4xl mx-auto text-center">
            <h1 class="text-5xl lg:text-7xl font-bold mb-6 text-surface-900 dark:text-surface-0">
              Bienvenido a Nuestra Tienda
            </h1>
            <p class="text-xl lg:text-2xl mb-10 text-surface-600 dark:text-surface-300">
              Descubre productos de calidad premium al mejor precio del mercado
            </p>
            
            <div class="flex justify-center gap-4 flex-wrap">
              <p-button 
                label="Explorar Catálogo"
                icon="pi pi-shopping-bag"
                size="large"
                severity="primary"
                [raised]="true"
                (onClick)="router.navigate(['/products'])"
              />
              <p-button 
                label="Mi Carrito"
                icon="pi pi-shopping-cart"
                [badge]="cart.totalItems() > 0 ? cart.totalItems().toString() : ''"
                severity="secondary"
                [outlined]="true"
                size="large"
                (onClick)="router.navigate(['/cart'])"
              />
            </div>
          </div>
        </div>
        
        <!-- Decorative Wave -->
        <div class="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" class="w-full h-16 fill-surface-0 dark:fill-surface-900">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      <div class="px-6 lg:px-20 py-12">
        <!-- Categorías -->
        @if (categories().length > 0) {
          <div class="mb-16">
            <div class="text-center mb-8">
              <h2 class="text-3xl lg:text-4xl font-bold mb-3 text-surface-900 dark:text-surface-0">
                Explora por Categoría
              </h2>
              <p class="text-muted-color text-lg">
                Encuentra exactamente lo que buscas
              </p>
            </div>
            <div class="flex gap-3 justify-center flex-wrap max-w-4xl mx-auto">
              @for (category of categories(); track category.id) {
                <p-button 
                  [label]="category.name"
                  icon="pi pi-tag"
                  [outlined]="true"
                  size="large"
                  styleClass="hover:scale-105 transition-transform"
                  (onClick)="filterByCategory(category.id)"
                />
              }
            </div>
          </div>
        }

        <!-- Productos Destacados con Carousel Mejorado -->
        @if (featuredProducts().length > 0) {
          <div class="mb-16">
            <div class="flex justify-between items-center mb-8">
              <div>
                <h2 class="text-3xl lg:text-4xl font-bold mb-2 text-surface-900 dark:text-surface-0">
                  Productos Destacados
                </h2>
                <p class="text-muted-color text-lg">
                  Lo mejor de nuestra colección
                </p>
              </div>
              <p-button 
                label="Ver todos"
                icon="pi pi-arrow-right"
                [text]="true"
                iconPos="right"
                size="large"
                (onClick)="router.navigate(['/products'])"
              />
            </div>

            <p-carousel 
              [value]="featuredProducts()" 
              [numVisible]="4" 
              [numScroll]="1" 
              [circular]="true"
              [autoplayInterval]="5000"
              [responsiveOptions]="carouselResponsiveOptions"
              styleClass="custom-carousel"
            >
              <ng-template let-product pTemplate="item">
                <div class="m-3">
                  <div class="surface-card border border-surface-200 dark:border-surface-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 h-full">
                    <div class="relative">
                      @if (product.main_image) {
                        <img 
                          [src]="product.main_image" 
                          [alt]="product.name"
                          class="w-full cursor-pointer transition-transform hover:scale-105"
                          style="height: 280px; object-fit: cover;"
                          (click)="viewProduct(product.id)"
                        />
                      } @else {
                        <div class="w-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center cursor-pointer"
                             style="height: 280px;"
                             (click)="viewProduct(product.id)">
                          <i class="pi pi-image text-5xl text-muted-color"></i>
                        </div>
                      }
                      <div class="absolute top-3 left-3">
                        <p-tag value="Destacado" severity="success" icon="pi pi-star" styleClass="shadow-lg" />
                      </div>
                      <div class="absolute top-3 right-3">
                        <p-button 
                          icon="pi pi-heart"
                          [rounded]="true"
                          [text]="true"
                          severity="contrast"
                          size="small"
                          styleClass="bg-white/90 backdrop-blur-sm hover:bg-white"
                        />
                      </div>
                    </div>

                    <div class="p-5">
                      <h3 class="text-xl font-semibold mb-3 cursor-pointer hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]"
                          (click)="viewProduct(product.id)">
                        {{ product.name }}
                      </h3>
                      
                      @if (product.price_range) {
                        <div class="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                          Bs. {{ product.price_range.price | number:'1.2-2' }}
                        </div>
                      }
                      
                      <div class="flex gap-2">
                        <p-button 
                          icon="pi pi-eye" 
                          severity="secondary"
                          [outlined]="true"
                          label="Ver"
                          styleClass="flex-1"
                          (onClick)="viewProduct(product.id)"
                        />
                        <p-button 
                          icon="pi pi-shopping-cart"
                          label="Agregar"
                          styleClass="flex-1"
                          (onClick)="addToCart(product)"
                          [loading]="addingToCart() === product.id"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </ng-template>
            </p-carousel>
          </div>
        }

        <!-- Call to Action -->
        <div class="mt-16 bg-gradient-to-r from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-3xl p-12 text-center">
          <h3 class="text-3xl lg:text-4xl font-bold mb-4 text-surface-900 dark:text-surface-0">
            ¿No encuentras lo que buscas?
          </h3>
          <p class="text-xl text-muted-color mb-8">
            Explora nuestro catálogo completo con cientos de productos
          </p>
          <p-button 
            label="Ver Catálogo Completo"
            icon="pi pi-arrow-right"
            iconPos="right"
            size="large"
            [raised]="true"
            (onClick)="router.navigate(['/products'])"
          />
        </div>
      </div>

      @if (loading()) {
        <div class="text-center py-20">
          <p-progressSpinner 
            strokeWidth="3"
            animationDuration="1s"
          />
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

    @keyframes fade-in {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fade-in 0.8s ease-out;
    }

    :host ::ng-deep .custom-carousel {
      .p-carousel-content {
        padding: 0.5rem 0;
      }
      
      .p-carousel-prev,
      .p-carousel-next {
        width: 3rem;
        height: 3rem;
        border-radius: 50%;
        background: white;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        
        &:hover {
          background: var(--primary-color);
          color: white;
        }
      }
    }
  `]
})
export class ShoppingHomeComponent implements OnInit {
  private api = inject(ApiService);
  cart = inject(CartStore);
  router = inject(Router);
  private messageService = inject(MessageService);

  featuredProducts = signal<ProductListItem[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  addingToCart = signal<number | null>(null);

  ngOnInit() {
    this.loadCategories();
    this.loadFeaturedProducts();
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
    this.api.listProducts({ featured: true, page_size: 12 }).subscribe({
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
      price: product.price_range?.price || 0,
      qty: 1,
      image: product.main_image,
      code: product.sku
    });
    this.messageService.add({
      severity: 'success',
      summary: '¡Agregado!',
      detail: `${product.name} se agregó al carrito`,
      life: 3000
    });
    setTimeout(() => this.addingToCart.set(null), 500);
  }

  // Responsive options for carousel
  carouselResponsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 4,
      numScroll: 1
    },
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];
}
