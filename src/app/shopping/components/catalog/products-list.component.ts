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

      <!-- Lista de productos -->
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
          layout="grid"
        >
          <ng-template pTemplate="header">
            <div class="flex justify-between items-center">
              <span class="text-muted-color">{{ totalProducts() }} productos encontrados</span>
            </div>
          </ng-template>

          <ng-template let-product pTemplate="gridItem">
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

                  @if (product.is_featured) {
                    <p-tag 
                      value="Destacado" 
                      severity="success"
                      icon="pi pi-star"
                      class="absolute top-2 right-2"
                    />
                  }
                </div>

                <!-- Info -->
                <div class="mb-3">
                  <div class="text-xs text-muted-color mb-1">
                    {{ product.category_names?.join(' > ') || 'Sin categoría' }}
                  </div>
                  <h4 class="text-lg font-semibold mb-2 truncate cursor-pointer hover:text-primary"
                      (click)="viewProduct(product.id)">
                    {{ product.name }}
                  </h4>
                  <p class="text-sm text-muted-color line-clamp-2 mb-2">
                    {{ product.description || 'Sin descripción' }}
                  </p>

                  <!-- Precio -->
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
    this.router.navigate(['/admin/products', id]);
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
    this.router.navigate(['/admin/cart']);
  }
}
