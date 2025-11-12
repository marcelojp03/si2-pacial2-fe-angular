import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Address, CreateAddressRequest, UpdateAddressRequest } from '../models/address.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.api.baseUrl}/sales/addresses`;

  /**
   * Obtener direcciones del cliente
   * @param customerId ID del cliente
   * @returns Observable con array de direcciones
   */
  getAddresses(customerId: number): Observable<Address[]> {
    const params = new HttpParams().set('customer', customerId.toString());
    return this.http.get<Address[]>(`${this.apiUrl}/`, { params });
  }

  /**
   * Obtener dirección por ID
   * @param addressId ID de la dirección
   * @returns Observable con dirección
   */
  getAddress(addressId: number): Observable<Address> {
    return this.http.get<Address>(`${this.apiUrl}/${addressId}/`);
  }

  /**
   * Crear nueva dirección
   * @param address Datos de la dirección
   * @returns Observable con dirección creada
   */
  createAddress(address: CreateAddressRequest): Observable<Address> {
    return this.http.post<Address>(`${this.apiUrl}/`, address);
  }

  /**
   * Actualizar dirección existente
   * @param addressId ID de la dirección
   * @param address Datos a actualizar
   * @returns Observable con dirección actualizada
   */
  updateAddress(addressId: number, address: UpdateAddressRequest): Observable<Address> {
    return this.http.patch<Address>(`${this.apiUrl}/${addressId}/`, address);
  }

  /**
   * Eliminar dirección
   * @param addressId ID de la dirección
   * @returns Observable vacío
   */
  deleteAddress(addressId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${addressId}/`);
  }

  /**
   * Establecer dirección como predeterminada
   * @param addressId ID de la dirección
   * @returns Observable con dirección actualizada
   */
  setDefaultAddress(addressId: number): Observable<Address> {
    return this.updateAddress(addressId, { is_default: true });
  }
}
