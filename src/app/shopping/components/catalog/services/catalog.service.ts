import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import type { Product, ProductFilters } from '../interfaces/product.interface';
import type { PaginatedResponse } from '../../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private api = inject(ApiService);

  listProducts(filters?: ProductFilters): Observable<PaginatedResponse<Product>> {
    return this.api.listProducts(filters) as unknown as Observable<PaginatedResponse<Product>>;
  }

  getProduct(id: number): Observable<Product> {
    return this.api.getProduct(id) as unknown as Observable<Product>;
  }

  getFeaturedProducts(): Observable<Product[]> {
    return this.api.getFeaturedProducts() as unknown as Observable<Product[]>;
  }
}
