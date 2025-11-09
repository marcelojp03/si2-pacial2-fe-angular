import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import type { Supplier, SupplierStats, SupplierFormData } from '../interfaces/supplier.interface';
import type { PaginatedResponse } from '../../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.api.baseUrl}/suppliers`;

  listSuppliers(search?: string): Observable<PaginatedResponse<Supplier>> {
    const params = search ? { search } : undefined;
    return this.http.get<PaginatedResponse<Supplier>>(`${this.baseUrl}/`, { params });
  }

  getSupplier(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.baseUrl}/${id}/`);
  }

  createSupplier(data: SupplierFormData): Observable<Supplier> {
    return this.http.post<Supplier>(`${this.baseUrl}/`, data);
  }

  updateSupplier(id: number, data: Partial<SupplierFormData>): Observable<Supplier> {
    return this.http.patch<Supplier>(`${this.baseUrl}/${id}/`, data);
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}/`);
  }

  getSupplierStats(): Observable<SupplierStats> {
    return this.http.get<SupplierStats>(`${this.baseUrl}/stats/`);
  }
}
