import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { CustomerProfile, UpdateProfileRequest, ChangePasswordRequest, UploadAvatarRequest, UploadAvatarResponse } from '../models/customer.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.api.baseUrl}/customers`;

  /**
   * Obtener perfil del cliente autenticado
   * @returns Observable con datos del perfil
   */
  getProfile(): Observable<CustomerProfile> {
    return this.http.get<CustomerProfile>(`${this.apiUrl}/profile/`);
  }

  /**
   * Actualizar perfil del cliente
   * @param data Datos a actualizar
   * @returns Observable con perfil actualizado
   */
  updateProfile(data: UpdateProfileRequest): Observable<CustomerProfile> {
    return this.http.patch<CustomerProfile>(`${this.apiUrl}/profile/`, data).pipe(
      tap(profile => {
        // Actualizar usuario en AuthService si cambió el nombre
        if (data.first_name || data.last_name) {
          const currentUser = this.authService.getCurrentUser();
          if (currentUser) {
            const updatedUser = {
              ...currentUser,
              first_name: profile.user.first_name,
              last_name: profile.user.last_name
            };
            localStorage.setItem('user', JSON.stringify(updatedUser));
          }
        }
      })
    );
  }

  /**
   * Cambiar contraseña del cliente
   * @param data Contraseña actual y nueva
   * @returns Observable con respuesta
   */
  changePassword(data: ChangePasswordRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password/`, data);
  }

  /**
   * Subir avatar del cliente a AWS S3
   * @param file Archivo de imagen (File object)
   * @returns Observable con URL del avatar y datos actualizados
   */
  uploadAvatar(file: File): Observable<UploadAvatarResponse> {
    return new Observable(observer => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const base64Image = reader.result as string;
        const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
        
        const requestData: UploadAvatarRequest = {
          image: base64Image,
          extension: extension
        };
        
        this.http.post<UploadAvatarResponse>(`${this.apiUrl}/upload-avatar/`, requestData).pipe(
          tap(response => {
            // Actualizar usuario en localStorage con nuevo avatar
            const currentUser = this.authService.getCurrentUser();
            if (currentUser) {
              const updatedUser = {
                ...currentUser,
                avatar: response.avatar_url,
                avatar_s3_key: response.avatar_s3_key,
                avatar_s3_bucket: response.avatar_s3_bucket
              };
              localStorage.setItem('user', JSON.stringify(updatedUser));
            }
          })
        ).subscribe({
          next: (response) => {
            observer.next(response);
            observer.complete();
          },
          error: (error) => {
            observer.error(error);
          }
        });
      };
      
      reader.onerror = (error) => {
        observer.error(error);
      };
      
      reader.readAsDataURL(file);
    });
  }
}
