import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import type { Category } from '../interfaces/category.interface';
import type { PaginatedResponse } from '../../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private api = inject(ApiService);

  listCategories(params?: any): Observable<PaginatedResponse<Category>> {
    return this.api.listCategories(params) as Observable<PaginatedResponse<Category>>;
  }

  getCategory(id: number): Observable<Category> {
    return this.api.getCategory(id) as Observable<Category>;
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return this.api.createCategory(data) as Observable<Category>;
  }

  updateCategory(id: number, data: Partial<Category>): Observable<Category> {
    return this.api.updateCategory(id, data) as Observable<Category>;
  }

  deleteCategory(id: number): Observable<void> {
    return this.api.deleteCategory(id);
  }
}
