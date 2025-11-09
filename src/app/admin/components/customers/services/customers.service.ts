import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/services/api.service';
import type { Customer } from '../interfaces/customer.interface';
import type { PaginatedResponse } from '../../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {
  private api = inject(ApiService);

  listCustomers(params?: any): Observable<PaginatedResponse<Customer>> {
    return this.api.listCustomers(params) as Observable<PaginatedResponse<Customer>>;
  }

  getCustomer(id: number): Observable<Customer> {
    return this.api.getCustomer(id) as Observable<Customer>;
  }

  createCustomer(data: Partial<Customer>): Observable<Customer> {
    return this.api.createCustomer(data) as Observable<Customer>;
  }

  updateCustomer(id: number, data: Partial<Customer>): Observable<Customer> {
    return this.api.updateCustomer(id, data) as Observable<Customer>;
  }

  deleteCustomer(id: number): Observable<void> {
    return this.api.deleteCustomer(id);
  }
}
