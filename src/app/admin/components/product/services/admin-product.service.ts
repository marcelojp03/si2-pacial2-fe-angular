import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import type { AdminProduct, ProductStats, ProductFormData } from '../interfaces/admin-product.interface';
import type { PaginatedResponse } from '../../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class AdminProductService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.api.baseUrl}/catalog/products`;

  listProducts(filters?: any): Observable<PaginatedResponse<AdminProduct>> {
    return this.http.get<PaginatedResponse<AdminProduct>>(`${this.baseUrl}/`, { params: filters });
  }

  getProduct(id: number): Observable<AdminProduct> {
    return this.http.get<AdminProduct>(`${this.baseUrl}/${id}/`);
  }

  createProduct(data: ProductFormData): Observable<AdminProduct> {
    return this.http.post<AdminProduct>(`${this.baseUrl}/`, data);
  }

  updateProduct(id: number, data: Partial<ProductFormData>): Observable<AdminProduct> {
    return this.http.put<AdminProduct>(`${this.baseUrl}/${id}/`, data);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`);
  }

  getProductStats(): Observable<ProductStats> {
    return this.http.get<ProductStats>(`${this.baseUrl}/stats/`);
  }

  uploadProductImage(productId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.baseUrl}/${productId}/images/`, formData);
  }

  deleteProductImage(productId: number, imageId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${productId}/images/${imageId}/`);
  }
}
