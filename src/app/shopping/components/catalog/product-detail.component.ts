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
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
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
      
      // CartStore maneja automáticamente localStorage o backend según haya cart_id
      this.cart.addItem({
        variantId: variantId,
        productId: this.product()!.id,
        name: this.product()!.name,
        price: price,
        qty: 1,
        image: mainImage,
        code: this.product()!.sku
      });
      
      // CartStore ya muestra el toast, resetear loading después de 500ms
      setTimeout(() => this.addingToCart.set(false), 500);
    }
  }

  goBack() {
    this.router.navigate(['/products']);
  }
}
