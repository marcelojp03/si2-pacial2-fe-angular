import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import type { Attribute, AttributeResponse } from '../interfaces/attribute.interface';

@Injectable({
  providedIn: 'root'
})
export class AttributeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.baseUrl}/attributes`;

  getAll(): Observable<AttributeResponse> {
    return this.http.get<AttributeResponse>(this.apiUrl);
  }

  getById(id: number): Observable<{ data: Attribute }> {
    return this.http.get<{ data: Attribute }>(`${this.apiUrl}/${id}`);
  }

  create(attribute: Attribute): Observable<{ data: Attribute }> {
    return this.http.post<{ data: Attribute }>(this.apiUrl, attribute);
  }

  update(id: number, attribute: Attribute): Observable<{ data: Attribute }> {
    return this.http.put<{ data: Attribute }>(`${this.apiUrl}/${id}`, attribute);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  deleteMultiple(ids: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/bulk-delete`, { ids });
  }
}
