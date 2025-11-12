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
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss'
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
    
    // CartStore maneja automáticamente localStorage o backend según haya cart_id
    this.cart.addItem({
      variantId: product.id,
      productId: product.id,
      name: product.name,
      price: product.price_range?.price || 0,
      qty: 1,
      image: product.main_image,
      code: product.sku
    });
    
    // CartStore ya muestra el toast, resetear loading después de 1s
    setTimeout(() => this.addingToCart.set(null), 1000);
  }

  viewProduct(id: number) {
    this.router.navigate(['/products', id]);
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
