import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { Router } from '@angular/router';

// PrimeNG
import { MessageService } from 'primeng/api';

// Services
import { ApiService } from '../../../core/services/api.service';
import { CartStore } from '../../../core/state/cart.store';
import type { ProductListItem, Category } from '../../../core/models';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [SharedModule],
  providers: [MessageService],
  template: `
    <div class="card">
      <p-toast />
      
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-3xl font-bold">Catálogo de Productos</h3>
        <p-button 
          icon="pi pi-shopping-cart"
          [badge]="cart.totalItems().toString()"
          [outlined]="true"
          severity="success"
          (onClick)="goToCart()"
        />
      </div>

      <!-- Filtros -->
      <div class="flex gap-3 mb-4 flex-wrap">
        <span class="p-input-icon-left flex-1 min-w-[250px]">
          <i class="pi pi-search"></i>
          <input 
            pInputText 
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch()"
            placeholder="Buscar productos..." 
            class="w-full"
          />
        </span>

        <p-select
          [(ngModel)]="selectedCategory"
          [options]="categories()"
          optionLabel="name"
          optionValue="id"
          placeholder="Todas las categorías"
          (onChange)="onCategoryChange()"
          [showClear]="true"
          class="min-w-[200px]"
        />

        <p-button 
          label="Destacados" 
          icon="pi pi-star"
          [outlined]="!showFeatured"
          (onClick)="toggleFeatured()"
        />
      </div>

      <!-- Lista de productos con DataView -->
      @if (loading()) {
        <div class="grid">
          @for (i of [1,2,3,4,5,6]; track i) {
            <div class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
              <p-skeleton height="20rem" />
            </div>
          }
        </div>
      } @else {
        <p-dataView 
          [value]="products()" 
          [paginator]="true" 
          [rows]="12"
          [layout]="layout"
        >
          <ng-template pTemplate="header">
            <div class="flex justify-between items-center">
              <span class="text-muted-color">{{ totalProducts() }} productos encontrados</span>
              <p-select-button 
                [(ngModel)]="layout" 
                [options]="layoutOptions" 
                [allowEmpty]="false"
              >
                <ng-template pTemplate="item" let-option>
                  <i class="pi" [ngClass]="{ 'pi-bars': option === 'list', 'pi-th-large': option === 'grid' }"></i>
                </ng-template>
              </p-select-button>
            </div>
          </ng-template>

          <!-- Vista Grid -->
          <ng-template let-product pTemplate="gridItem">
            <div class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
              <div class="p-6 border border-surface-200 dark:border-surface-700 bg-surface-0 dark:bg-surface-900 rounded flex flex-col hover:shadow-lg transition-shadow">
                <!-- Imagen -->
                <div class="bg-surface-50 flex justify-center rounded p-4 mb-4">
                  <div class="relative mx-auto w-full">
                    @if (product.main_image) {
                      <img 
                        [src]="product.main_image" 
                        [alt]="product.name"
                        class="rounded w-full cursor-pointer"
                        style="max-width: 300px; max-height: 200px; object-fit: contain;"
                        (click)="viewProduct(product.id)"
                      />
                    } @else {
                      <div class="w-full h-48 bg-surface-100 dark:bg-surface-800 rounded flex items-center justify-center cursor-pointer"
                           (click)="viewProduct(product.id)">
                        <i class="pi pi-image text-4xl text-muted-color"></i>
                      </div>
                    }

                    @if (product.is_featured) {
                      <div class="absolute bg-black/70 rounded-border" style="left: 4px; top: 4px;">
                        <p-tag value="Destacado" severity="success" icon="pi pi-star" />
                      </div>
                    }
                  </div>
                </div>

                <!-- Info -->
                <div class="pt-4">
                  <div class="flex flex-row justify-between items-start gap-2 mb-3">
                    <div class="flex-1">
                      <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
                        {{ product.category_names?.[0] || 'Sin categoría' }}
                      </span>
                      <div class="text-lg font-medium mt-1 cursor-pointer hover:text-primary"
                           (click)="viewProduct(product.id)">
                        {{ product.name }}
                      </div>
                    </div>
                    @if (product.stock_status) {
                      <div class="bg-surface-100 p-1" style="border-radius: 30px">
                        <div class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2" 
                             style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04);">
                          <i class="pi pi-check-circle text-green-500"></i>
                          <span class="text-surface-900 font-medium text-xs">Stock</span>
                        </div>
                      </div>
                    }
                  </div>

                  <div class="flex flex-col gap-4">
                    <!-- Precio -->
                    @if (product.price_range) {
                      <span class="text-2xl font-semibold">
                        @if (product.price_range.min === product.price_range.max) {
                          Bs. {{ product.price_range.min | number:'1.2-2' }}
                        } @else {
                          Bs. {{ product.price_range.min | number:'1.2-2' }} - {{ product.price_range.max | number:'1.2-2' }}
                        }
                      </span>
                    }

                    <!-- Acciones -->
                    <div class="flex gap-2">
                      <p-button 
                        icon="pi pi-shopping-cart"
                        label="Añadir"
                        styleClass="w-full"
                        (onClick)="addToCart(product)"
                        [loading]="addingToCart() === product.id"
                      />
                      <p-button 
                        icon="pi pi-eye"
                        styleClass="h-full"
                        [outlined]="true"
                        (onClick)="viewProduct(product.id)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ng-template>

          <!-- Vista Lista -->
          <ng-template let-product pTemplate="listItem">
            <div class="flex flex-col sm:flex-row sm:items-center p-6 gap-4 border-t border-surface">
              <div class="md:w-40 relative">
                @if (product.main_image) {
                  <img 
                    class="block mx-auto rounded w-full cursor-pointer"
                    [src]="product.main_image" 
                    [alt]="product.name"
                    (click)="viewProduct(product.id)"
                  />
                } @else {
                  <div class="w-full h-32 bg-surface-100 dark:bg-surface-800 rounded flex items-center justify-center cursor-pointer"
                       (click)="viewProduct(product.id)">
                    <i class="pi pi-image text-3xl text-muted-color"></i>
                  </div>
                }
                
                @if (product.is_featured) {
                  <div class="absolute bg-black/70 rounded-border" style="left: 4px; top: 4px;">
                    <p-tag value="Destacado" severity="success" />
                  </div>
                }
              </div>

              <div class="flex flex-col md:flex-row justify-between md:items-center flex-1 gap-6">
                <div class="flex flex-row md:flex-col justify-between items-start gap-2">
                  <div>
                    <span class="font-medium text-surface-500 dark:text-surface-400 text-sm">
                      {{ product.category_names?.join(' > ') || 'Sin categoría' }}
                    </span>
                    <div class="text-lg font-medium mt-2 cursor-pointer hover:text-primary"
                         (click)="viewProduct(product.id)">
                      {{ product.name }}
                    </div>
                    <p class="text-sm text-muted-color mt-2 line-clamp-2">
                      {{ product.description || 'Sin descripción disponible' }}
                    </p>
                  </div>
                  @if (product.stock_status) {
                    <div class="bg-surface-100 p-1" style="border-radius: 30px">
                      <div class="bg-surface-0 flex items-center gap-2 justify-center py-1 px-2"
                           style="border-radius: 30px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.04);">
                        <span class="text-surface-900 font-medium text-sm">En Stock</span>
                        <i class="pi pi-check-circle text-green-500"></i>
                      </div>
                    </div>
                  }
                </div>

                <div class="flex flex-col md:items-end gap-8">
                  @if (product.price_range) {
                    <span class="text-xl font-semibold">
                      @if (product.price_range.min === product.price_range.max) {
                        Bs. {{ product.price_range.min | number:'1.2-2' }}
                      } @else {
                        Bs. {{ product.price_range.min | number:'1.2-2' }} - {{ product.price_range.max | number:'1.2-2' }}
                      }
                    </span>
                  }

                  <div class="flex flex-row-reverse md:flex-row gap-2">
                    <p-button 
                      icon="pi pi-eye" 
                      styleClass="h-full"
                      [outlined]="true"
                      (onClick)="viewProduct(product.id)"
                    />
                    <p-button 
                      icon="pi pi-shopping-cart"
                      label="Añadir"
                      styleClass="flex-auto md:flex-initial whitespace-nowrap"
                      (onClick)="addToCart(product)"
                      [loading]="addingToCart() === product.id"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ng-template>

          <ng-template pTemplate="empty">
            <div class="text-center py-12">
              <i class="pi pi-inbox text-6xl text-muted-color mb-4"></i>
              <p class="text-xl text-muted-color">No se encontraron productos</p>
              @if (searchQuery || selectedCategory || showFeatured) {
                <p-button 
                  label="Limpiar filtros" 
                  (onClick)="clearFilters()"
                  [outlined]="true"
                  class="mt-4"
                />
              }
            </div>
          </ng-template>
        </p-dataView>
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
export class ProductsListComponent implements OnInit {
  private api = inject(ApiService);
  cart = inject(CartStore);
  private router = inject(Router);
  private messageService = inject(MessageService);

  // Signals
  products = signal<ProductListItem[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  totalProducts = signal(0);
  addingToCart = signal<number | null>(null);

  // Filters
  searchQuery = '';
  selectedCategory: number | null = null;
  showFeatured = false;
  
  // Layout
  layout: 'list' | 'grid' = 'grid';
  layoutOptions = ['list', 'grid'];

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
    this.cart.loadFromLocalStorage();
  }

  loadCategories() {
    this.api.listCategories().subscribe({
      next: (res: any) => this.categories.set(res.results),
      error: (err: any) => console.error('Error loading categories:', err)
    });
  }

  loadProducts() {
    this.loading.set(true);
    
    const params: any = {};
    if (this.searchQuery) params.search = this.searchQuery;
    if (this.selectedCategory) params.category = this.selectedCategory;
    if (this.showFeatured) params.featured = true;

    this.api.listProducts(params).subscribe({
      next: (res: any) => {
        this.products.set(res.results);
        this.totalProducts.set(res.count);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading products:', err);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los productos'
        });
      }
    });
  }

  onSearch() {
    this.loadProducts();
  }

  onCategoryChange() {
    this.loadProducts();
  }

  toggleFeatured() {
    this.showFeatured = !this.showFeatured;
    this.loadProducts();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.showFeatured = false;
    this.loadProducts();
  }

  viewProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  addToCart(product: ProductListItem) {
    this.addingToCart.set(product.id);
    
    // Simulación de agregar al carrito (en producción, verificar variantes)
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

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
