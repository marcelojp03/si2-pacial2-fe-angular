import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import type { InventoryAdjustment, AdjustmentResponse } from '../interfaces/adjustment.interface';

@Injectable({
  providedIn: 'root'
})
export class AdjustmentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.baseUrl}/inventory/adjustments`;

  getAll(): Observable<AdjustmentResponse> {
    return this.http.get<AdjustmentResponse>(this.apiUrl);
  }

  getById(id: number): Observable<{ data: InventoryAdjustment }> {
    return this.http.get<{ data: InventoryAdjustment }>(`${this.apiUrl}/${id}`);
  }

  create(adjustment: InventoryAdjustment): Observable<{ data: InventoryAdjustment }> {
    return this.http.post<{ data: InventoryAdjustment }>(this.apiUrl, adjustment);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
