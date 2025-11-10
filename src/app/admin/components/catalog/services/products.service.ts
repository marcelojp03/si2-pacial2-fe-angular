import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import type { Product, ProductListItem, ProductFormData, ProductFilters } from '../interfaces/product.interface';
import type { PaginatedResponse } from '../../../../core/models/api.model';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.baseUrl}/catalog/products`;

  /**
   * Lista todos los productos con filtros y paginación
   */
  list(filters?: ProductFilters): Observable<PaginatedResponse<ProductListItem>> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<PaginatedResponse<ProductListItem>>(this.apiUrl + '/', { params });
  }

  /**
   * Obtiene productos destacados
   */
  getFeatured(): Observable<ProductListItem[]> {
    return this.http.get<ProductListItem[]>(`${this.apiUrl}/featured/`);
  }

  /**
   * Obtiene un producto por ID con detalles completos
   */
  get(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}/`);
  }

  /**
   * Crea un nuevo producto
   */
  create(data: ProductFormData): Observable<Product> {
    return this.http.post<Product>(this.apiUrl + '/', data);
  }

  /**
   * Actualiza un producto existente
   */
  update(id: number, data: Partial<ProductFormData>): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/`, data);
  }

  /**
   * Elimina un producto
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }

  /**
   * Actualiza el estado de un producto (activo/inactivo/borrador)
   */
  updateStatus(id: number, status: 'ACTIVE' | 'INACTIVE' | 'DRAFT'): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/`, { status });
  }

  /**
   * Marca/desmarca un producto como destacado
   */
  toggleFeatured(id: number, isFeatured: boolean): Observable<Product> {
    return this.http.patch<Product>(`${this.apiUrl}/${id}/`, { is_featured: isFeatured });
  }
}
