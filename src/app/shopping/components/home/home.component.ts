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
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
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
    
    // CartStore ya muestra el toast, resetear loading después de 500ms
    setTimeout(() => this.addingToCart.set(null), 500);
  }
}
