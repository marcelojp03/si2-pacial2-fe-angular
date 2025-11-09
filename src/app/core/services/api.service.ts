import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  Address,
  Cart,
  Category,
  CheckoutRequest,
  ConfirmPaymentRequest,
  Customer,
  ForecastResponse,
  Inventory,
  Order,
  PaginatedResponse,
  Product,
  ProductListItem,
  ReportRequest,
  ReportResponse,
  SalesDashboard,
  Warehouse,
} from '../models';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.api.baseUrl;

  // ========================================
  // CATALOG - Categories
  // ========================================

  listCategories(params?: any): Observable<PaginatedResponse<Category>> {
    return this.http.get<PaginatedResponse<Category>>(`${this.baseUrl}/catalog/categories/`, { params });
  }

  getCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/catalog/categories/${id}/`);
  }

  createCategory(data: Partial<Category>): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}/catalog/categories/`, data);
  }

  updateCategory(id: number, data: Partial<Category>): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/catalog/categories/${id}/`, data);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/catalog/categories/${id}/`);
  }

  getRootCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/catalog/categories/root/`);
  }

  // ========================================
  // CATALOG - Products
  // ========================================

  listProducts(params?: {
    category?: number;
    search?: string;
    min_price?: number;
    max_price?: number;
    featured?: boolean;
    page?: number;
    page_size?: number;
  }): Observable<PaginatedResponse<ProductListItem>> {
    let httpParams = new HttpParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }
    return this.http.get<PaginatedResponse<ProductListItem>>(`${this.baseUrl}/catalog/products/`, { params: httpParams });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/catalog/products/${id}/`);
  }

  createProduct(data: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}/catalog/products/`, data);
  }

  updateProduct(id: number, data: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/catalog/products/${id}/`, data);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/catalog/products/${id}/`);
  }

  getFeaturedProducts(): Observable<ProductListItem[]> {
    return this.http.get<ProductListItem[]>(`${this.baseUrl}/catalog/products/featured/`);
  }

  // ========================================
  // INVENTORY - Warehouses
  // ========================================

  listWarehouses(params?: any): Observable<PaginatedResponse<Warehouse>> {
    return this.http.get<PaginatedResponse<Warehouse>>(`${this.baseUrl}/inventory/warehouses/`, { params });
  }

  getWarehouse(id: number): Observable<Warehouse> {
    return this.http.get<Warehouse>(`${this.baseUrl}/inventory/warehouses/${id}/`);
  }

  createWarehouse(data: Partial<Warehouse>): Observable<Warehouse> {
    return this.http.post<Warehouse>(`${this.baseUrl}/inventory/warehouses/`, data);
  }

  getWarehouseInventory(id: number): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.baseUrl}/inventory/warehouses/${id}/inventory/`);
  }

  getWarehouseLowStock(id: number): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.baseUrl}/inventory/warehouses/${id}/low_stock/`);
  }

  // ========================================
  // INVENTORY - Inventory
  // ========================================

  listInventory(params?: {
    warehouse?: number;
    variant?: number;
    low_stock?: boolean;
    page?: number;
  }): Observable<PaginatedResponse<Inventory>> {
    return this.http.get<PaginatedResponse<Inventory>>(`${this.baseUrl}/inventory/inventory/`, { params });
  }

  getInventory(id: number): Observable<Inventory> {
    return this.http.get<Inventory>(`${this.baseUrl}/inventory/inventory/${id}/`);
  }

  adjustStock(id: number, data: { quantity: number; reason: string }): Observable<any> {
    return this.http.post(`${this.baseUrl}/inventory/inventory/${id}/adjust_stock/`, data);
  }

  reserveStock(id: number, data: { quantity: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/inventory/inventory/${id}/reserve/`, data);
  }

  confirmSale(id: number, data: { quantity: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/inventory/inventory/${id}/confirm_sale/`, data);
  }

  releaseStock(id: number, data: { quantity: number }): Observable<any> {
    return this.http.post(`${this.baseUrl}/inventory/inventory/${id}/release/`, data);
  }

  // ========================================
  // SALES - Customers
  // ========================================

  listCustomers(params?: { search?: string; page?: number }): Observable<PaginatedResponse<Customer>> {
    return this.http.get<PaginatedResponse<Customer>>(`${this.baseUrl}/sales/customers/`, { params });
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/sales/customers/${id}/`);
  }

  createCustomer(data: Partial<Customer>): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/sales/customers/`, data);
  }

  updateCustomer(id: number, data: Partial<Customer>): Observable<Customer> {
    return this.http.put<Customer>(`${this.baseUrl}/sales/customers/${id}/`, data);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/sales/customers/${id}/`);
  }

  getCustomerOrders(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/sales/customers/${id}/orders/`);
  }

  // ========================================
  // SALES - Addresses
  // ========================================

  listAddresses(params?: { customer?: number }): Observable<PaginatedResponse<Address>> {
    return this.http.get<PaginatedResponse<Address>>(`${this.baseUrl}/sales/addresses/`, { params });
  }

  createAddress(data: Partial<Address>): Observable<Address> {
    return this.http.post<Address>(`${this.baseUrl}/sales/addresses/`, data);
  }

  // ========================================
  // SALES - Cart
  // ========================================

  getCart(id: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.baseUrl}/sales/carts/${id}/`);
  }

  addToCart(cartId: number, data: { variant_id: number; quantity: number }): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/sales/carts/${cartId}/add_item/`, data);
  }

  removeFromCart(cartId: number, itemId: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/sales/carts/${cartId}/remove_item/${itemId}/`, {});
  }

  clearCart(cartId: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.baseUrl}/sales/carts/${cartId}/clear/`, {});
  }

  checkout(cartId: number, data: CheckoutRequest): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}/sales/carts/${cartId}/checkout/`, data);
  }

  // ========================================
  // SALES - Orders
  // ========================================

  listOrders(params?: {
    customer?: number;
    status?: string;
    search?: string;
    page?: number;
  }): Observable<PaginatedResponse<Order>> {
    return this.http.get<PaginatedResponse<Order>>(`${this.baseUrl}/sales/orders/`, { params });
  }

  getOrder(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/sales/orders/${id}/`);
  }

  confirmPayment(orderId: number, data: ConfirmPaymentRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/sales/orders/${orderId}/confirm_payment/`, data);
  }

  cancelOrder(orderId: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/sales/orders/${orderId}/cancel/`, {});
  }

  // ========================================
  // ANALYTICS - Sales Dashboard
  // ========================================

  getSalesDashboard(days: number = 30): Observable<SalesDashboard> {
    return this.http.get<SalesDashboard>(`${this.baseUrl}/analytics/sales/dashboard/`, {
      params: { days: days.toString() }
    });
  }

  generateReport(data: ReportRequest): Observable<ReportResponse> {
    return this.http.post<ReportResponse>(`${this.baseUrl}/analytics/sales/generate_report/`, data);
  }

  // ========================================
  // ANALYTICS - Forecasting
  // ========================================

  predictSales(forecastId: number, data: {
    product_id: number;
    periods: number;
    model_type?: string;
  }): Observable<ForecastResponse> {
    return this.http.post<ForecastResponse>(`${this.baseUrl}/analytics/forecasts/${forecastId}/predict/`, data);
  }

  // ========================================
  // AUTH
  // ========================================

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/auth/login/`, { username, password });
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout/`, {});
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/me/`);
  }

  getMenu(): Observable<any> {
    return this.http.get(`${this.baseUrl}/auth/menu/`);
  }

  // ========================================
  // SYSTEM
  // ========================================

  healthCheck(): Observable<any> {
    return this.http.get(`${this.baseUrl}/healthz/`);
  }
}
