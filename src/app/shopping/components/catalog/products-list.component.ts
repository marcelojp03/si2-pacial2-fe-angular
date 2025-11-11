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
    <div class="min-h-screen bg-surface-50 dark:bg-surface-900">
      <p-toast />
      
      <!-- Header -->
      <div class="bg-surface-0 dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 py-12 px-6 lg:px-20 mb-8">
        <div class="max-w-7xl mx-auto">
          <div class="flex justify-between items-center mb-6">
            <div>
              <h1 class="text-4xl lg:text-5xl font-bold mb-2 text-surface-900 dark:text-surface-0">Catálogo de Productos</h1>
              <p class="text-surface-600 dark:text-surface-300 text-lg">Explora nuestra colección completa</p>
            </div>
            <p-button 
              icon="pi pi-shopping-cart"
              [badge]="cart.totalItems() > 0 ? cart.totalItems().toString() : ''"
              severity="contrast"
              [outlined]="true"
              size="large"
              (onClick)="goToCart()"
            />
          </div>

          <!-- Filtros en el Header -->
          <div class="flex gap-3 flex-wrap">
            <span class="p-input-icon-left flex-1 min-w-[280px]">
              <i class="pi pi-search"></i>
              <input 
                pInputText 
                [(ngModel)]="searchQuery"
                (ngModelChange)="onSearch()"
                placeholder="Buscar productos por nombre, descripción..." 
                class="w-full"
                style="background: rgba(255,255,255,0.95); border: none;"
              />
            </span>

            <p-select 
              [(ngModel)]="selectedCategory"
              [options]="categories()"
              optionLabel="name"
              optionValue="id"
              placeholder="Todas las categorías"
              [showClear]="true"
              (onChange)="onCategoryChange()"
              styleClass="min-w-[200px]"
              [style]="{'background': 'rgba(255,255,255,0.95)', 'border': 'none'}"
            />

            <p-button 
              [label]="showFeatured ? 'Todos' : 'Destacados'"
              [icon]="showFeatured ? 'pi pi-th-large' : 'pi pi-star'"
              [severity]="showFeatured ? 'secondary' : 'primary'"
              [outlined]="!showFeatured"
              (onClick)="toggleFeatured()"
              styleClass="whitespace-nowrap"
            />
          </div>
        </div>
      </div>

      <!-- Contenedor Principal -->
      <div class="px-6 lg:px-20 pb-12">
        <div class="max-w-7xl mx-auto">
          @if (loading()) {
            <!-- Spinner de Carga -->
            <div class="flex flex-col items-center justify-center py-20">
              <p-progressSpinner 
                strokeWidth="4" 
                animationDuration="1s"
                styleClass="w-20 h-20"
              />
              <p class="text-xl text-muted-color mt-6">Cargando productos...</p>
            </div>
          } @else if (products().length === 0) {
            <div class="text-center py-20 bg-surface-0 dark:bg-surface-800 rounded-2xl">
              <i class="pi pi-inbox text-7xl text-muted-color mb-6 block"></i>
              <h3 class="text-2xl font-semibold mb-3 text-surface-900 dark:text-surface-0">
                No se encontraron productos
              </h3>
              <p class="text-lg text-muted-color">
                La lista de productos está vacía
              </p>
            </div>
          } @else {
            <!-- Header de Productos -->
            <div class="surface-card rounded-2xl border border-surface-200 dark:border-surface-700 mb-6 p-4">
              <div class="flex items-center gap-3">
                <i class="pi pi-box text-2xl text-primary-500"></i>
                <div>
                  <div class="font-semibold text-lg text-surface-900 dark:text-surface-0">
                    {{ totalProducts() }} productos encontrados
                  </div>
                </div>
              </div>
            </div>

            <!-- Grid de Productos -->
            <div class="grid">
              @for (product of products(); track product.id) {
                <div class="col-12 sm:col-6 lg:col-4 xl:col-3 p-3">
                  <div class="surface-card border border-surface-200 dark:border-surface-700 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                    <!-- Imagen -->
                    <div class="relative bg-surface-50 dark:bg-surface-800">
                      @if (product.main_image) {
                        <img 
                          [src]="product.main_image" 
                          [alt]="product.name"
                          class="w-full cursor-pointer transition-transform hover:scale-105"
                          style="height: 280px; object-fit: cover;"
                          (click)="viewProduct(product.id)"
                        />
                      } @else {
                        <div class="w-full flex items-center justify-center cursor-pointer"
                             style="height: 280px;"
                             (click)="viewProduct(product.id)">
                          <i class="pi pi-image text-5xl text-muted-color"></i>
                        </div>
                      }

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

                    <!-- Info -->
                    <div class="p-5 flex-1 flex flex-col">
                      <div class="flex-1">
                        <span class="text-xs font-medium text-primary-500 uppercase tracking-wide">
                          {{ product.category_names[0] || 'Sin categoría' }}
                        </span>
                        <h3 class="text-lg font-semibold mt-2 mb-3 cursor-pointer hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem]"
                            (click)="viewProduct(product.id)">
                          {{ product.name }}
                        </h3>

                        @if (product.price_range) {
                          <div class="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-4">
                            Bs. {{ product.price_range.price | number:'1.2-2' }}
                          </div>
                        }
                      </div>

                      <!-- Acciones -->
                      <div class="flex gap-2 mt-auto">
                        <p-button 
                          icon="pi pi-shopping-cart"
                          label="Agregar"
                          styleClass="flex-1"
                          (onClick)="addToCart(product)"
                          [loading]="addingToCart() === product.id"
                        />
                        <p-button 
                          icon="pi pi-eye"
                          severity="secondary"
                          [outlined]="true"
                          (onClick)="viewProduct(product.id)"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              }
            </div>

            <!-- Paginador -->
            @if (totalProducts() > pageSize) {
              <div class="flex justify-center mt-6">
                <p-paginator 
                  [rows]="pageSize"
                  [totalRecords]="totalProducts()"
                  [first]="(currentPage - 1) * pageSize"
                  (onPageChange)="onPageChange($event)"
                  styleClass="border border-surface-200 rounded-xl"
                  [showCurrentPageReport]="true"
                  currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords} productos"
                ></p-paginator>
              </div>
            }
          }
        </div>
      </div>
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
  
  // Pagination
  currentPage = 1;
  pageSize = 12;

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
    
    const params: any = {
      page: this.currentPage,
      page_size: this.pageSize
    };
    if (this.searchQuery) params.search = this.searchQuery;
    if (this.selectedCategory) params.category = this.selectedCategory;
    if (this.showFeatured) params.featured = true;

    this.api.listProducts(params).subscribe({
      next: (res: any) => {
        console.log('Products list response:', res);
        console.log('First product in list:', res.results?.[0]);
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
    this.currentPage = 1; // Reset a primera página al buscar
    this.loadProducts();
  }

  onCategoryChange() {
    this.currentPage = 1; // Reset a primera página al cambiar categoría
    this.loadProducts();
  }

  toggleFeatured() {
    this.showFeatured = !this.showFeatured;
    this.currentPage = 1; // Reset a primera página
    this.loadProducts();
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedCategory = null;
    this.showFeatured = false;
    this.currentPage = 1;
    this.loadProducts();
  }

  onPageChange(event: any) {
    this.currentPage = event.page + 1; // PrimeNG usa índice 0, API usa índice 1
    this.loadProducts();
    // Scroll suave hacia arriba
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  addToCart(product: ProductListItem) {
    this.addingToCart.set(product.id);
    
    // Simulación de agregar al carrito (en producción, verificar variantes)
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
      detail: `${product.name} añadido al carrito`
    });
    
    setTimeout(() => this.addingToCart.set(null), 1000);
  }

  viewProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
