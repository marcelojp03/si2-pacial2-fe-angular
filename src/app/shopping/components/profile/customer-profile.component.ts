import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';
import { CustomerService } from '../../../core/services/customer.service';
import { CustomerProfile, UpdateProfileRequest, ChangePasswordRequest } from '../../../core/models/customer.model';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ButtonModule,
    InputTextModule,
    CardModule,
    DividerModule,
    ProgressSpinnerModule,
    PasswordModule,
    ToastModule
  ],
  providers: [MessageService],
  template: `
    <div class="min-h-screen bg-surface-50 py-8">
      <div class="max-w-7xl mx-auto px-4">
        <!-- Header -->
        <div class="mb-6">
          <button 
            pButton 
            icon="pi pi-arrow-left" 
            [text]="true" 
            label="Volver" 
            (click)="goBack()"
            class="mb-4"
          ></button>
          <h1 class="text-3xl font-bold text-surface-900">Mi Perfil</h1>
        </div>

        <!-- Loading State -->
        @if (loading()) {
          <div class="flex justify-center items-center py-20">
            <p-progressSpinner />
          </div>
        }

        <!-- Profile Content -->
        @if (!loading() && profile()) {
          <div class="grid lg:grid-cols-2 gap-6">
            <!-- Profile Information Card -->
            <p-card>
              <ng-template pTemplate="header">
                <div class="p-4 border-b">
                  <h2 class="text-xl font-semibold text-surface-900">
                    <i class="pi pi-user mr-2"></i>
                    Información Personal
                  </h2>
                </div>
              </ng-template>

              <form [formGroup]="profileForm" (ngSubmit)="updateProfile()">
                <div class="space-y-4">
                  <!-- Avatar Section -->
                  <div class="flex flex-col items-center mb-6 pb-6 border-b">
                    <div class="relative mb-4">
                      @if (profile()?.avatar || profile()?.user?.avatar) {
                        <img 
                          [src]="profile()?.avatar || profile()?.user?.avatar" 
                          alt="Avatar"
                          class="w-32 h-32 rounded-full object-cover border-4 border-primary"
                        />
                      } @else {
                        <div class="w-32 h-32 rounded-full bg-primary flex items-center justify-center text-white text-4xl font-bold">
                          {{ getInitials() }}
                        </div>
                      }
                      
                      <!-- Upload overlay -->
                      <label 
                        class="absolute bottom-0 right-0 bg-primary hover:bg-primary-600 text-white rounded-full p-3 cursor-pointer shadow-lg transition-all"
                        [class.opacity-50]="uploadingAvatar()"
                      >
                        <i class="pi pi-camera text-xl"></i>
                        <input 
                          type="file" 
                          accept="image/jpeg,image/png,image/webp,image/gif"
                          (change)="onAvatarSelected($event)"
                          class="hidden"
                          [disabled]="uploadingAvatar()"
                        />
                      </label>
                    </div>
                    
                    <p class="text-sm text-surface-600 text-center">
                      Click en la cámara para cambiar tu foto
                    </p>
                    <small class="text-surface-500 text-center">
                      JPG, PNG, WEBP o GIF. Máximo 5MB
                    </small>
                    
                    @if (uploadingAvatar()) {
                      <div class="flex items-center gap-2 mt-2 text-primary">
                        <i class="pi pi-spin pi-spinner"></i>
                        <span class="text-sm">Subiendo imagen...</span>
                      </div>
                    }
                  </div>

                  <!-- Email (read-only) -->
                  <div>
                    <label class="block text-sm font-medium text-surface-700 mb-2">
                      Correo Electrónico
                    </label>
                    <input 
                      type="email" 
                      pInputText 
                      [value]="profile()?.user?.email || ''"
                      [disabled]="true"
                      class="w-full bg-surface-100"
                    />
                    <small class="text-surface-500">El correo no se puede modificar</small>
                  </div>

                  <!-- First Name -->
                  <div>
                    <label class="block text-sm font-medium text-surface-700 mb-2">
                      Nombre *
                    </label>
                    <input 
                      type="text" 
                      pInputText 
                      formControlName="first_name"
                      class="w-full"
                      [class.ng-invalid]="profileForm.get('first_name')?.invalid && profileForm.get('first_name')?.touched"
                    />
                    @if (profileForm.get('first_name')?.invalid && profileForm.get('first_name')?.touched) {
                      <small class="text-red-500">El nombre es requerido</small>
                    }
                  </div>

                  <!-- Last Name -->
                  <div>
                    <label class="block text-sm font-medium text-surface-700 mb-2">
                      Apellido *
                    </label>
                    <input 
                      type="text" 
                      pInputText 
                      formControlName="last_name"
                      class="w-full"
                      [class.ng-invalid]="profileForm.get('last_name')?.invalid && profileForm.get('last_name')?.touched"
                    />
                    @if (profileForm.get('last_name')?.invalid && profileForm.get('last_name')?.touched) {
                      <small class="text-red-500">El apellido es requerido</small>
                    }
                  </div>

                  <!-- Phone -->
                  <div>
                    <label class="block text-sm font-medium text-surface-700 mb-2">
                      Teléfono
                    </label>
                    <input 
                      type="text" 
                      pInputText 
                      formControlName="phone"
                      class="w-full"
                      placeholder="Ej: +591 71234567"
                    />
                  </div>

                  <!-- Address -->
                  <div>
                    <label class="block text-sm font-medium text-surface-700 mb-2">
                      Dirección
                    </label>
                    <input 
                      type="text" 
                      pInputText 
                      formControlName="address"
                      class="w-full"
                      placeholder="Calle, número, zona"
                    />
                  </div>

                  <!-- City -->
                  <div>
                    <label class="block text-sm font-medium text-surface-700 mb-2">
                      Ciudad
                    </label>
                    <input 
                      type="text" 
                      pInputText 
                      formControlName="city"
                      class="w-full"
                      placeholder="Santa Cruz"
                    />
                  </div>

                  <!-- Country -->
                  <div>
                    <label class="block text-sm font-medium text-surface-700 mb-2">
                      País
                    </label>
                    <input 
                      type="text" 
                      pInputText 
                      formControlName="country"
                      class="w-full"
                      placeholder="Bolivia"
                    />
                  </div>

                  <!-- Postal Code -->
                  <div>
                    <label class="block text-sm font-medium text-surface-700 mb-2">
                      Código Postal
                    </label>
                    <input 
                      type="text" 
                      pInputText 
                      formControlName="postal_code"
                      class="w-full"
                      placeholder="0000"
                    />
                  </div>

                  <!-- Submit Button -->
                  <div class="flex justify-end gap-2 pt-4">
                    <p-button 
                      label="Cancelar" 
                      severity="secondary" 
                      [outlined]="true"
                      type="button"
                      (onClick)="loadProfile()"
                    />
                    <p-button 
                      label="Guardar Cambios" 
                      icon="pi pi-save"
                      type="submit"
                      [loading]="savingProfile()"
                      [disabled]="profileForm.invalid"
                    />
                  </div>
                </div>
              </form>
            </p-card>

            <!-- Change Password Card -->
            <p-card>
              <ng-template pTemplate="header">
                <div class="p-4 border-b">
                  <h2 class="text-xl font-semibold text-surface-900">
                    <i class="pi pi-lock mr-2"></i>
                    Cambiar Contraseña
                  </h2>
                </div>
              </ng-template>

              <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
                <div class="space-y-4">
                  <!-- Current Password -->
                  <div>
                    <label class="block text-sm font-medium text-surface-700 mb-2">
                      Contraseña Actual *
                    </label>
                    <p-password 
                      formControlName="old_password"
                      [toggleMask]="true"
                      [feedback]="false"
                      styleClass="w-full"
                      inputStyleClass="w-full"
                      [class.ng-invalid]="passwordForm.get('old_password')?.invalid && passwordForm.get('old_password')?.touched"
                    />
                    @if (passwordForm.get('old_password')?.invalid && passwordForm.get('old_password')?.touched) {
                      <small class="text-red-500">La contraseña actual es requerida</small>
                    }
                  </div>

                  <!-- New Password -->
                  <div>
                    <label class="block text-sm font-medium text-surface-700 mb-2">
                      Nueva Contraseña *
                    </label>
                    <p-password 
                      formControlName="new_password"
                      [toggleMask]="true"
                      [feedback]="true"
                      styleClass="w-full"
                      inputStyleClass="w-full"
                      [class.ng-invalid]="passwordForm.get('new_password')?.invalid && passwordForm.get('new_password')?.touched"
                    />
                    @if (passwordForm.get('new_password')?.invalid && passwordForm.get('new_password')?.touched) {
                      <small class="text-red-500">La contraseña debe tener al menos 8 caracteres</small>
                    }
                  </div>

                  <!-- Confirm New Password -->
                  <div>
                    <label class="block text-sm font-medium text-surface-700 mb-2">
                      Confirmar Nueva Contraseña *
                    </label>
                    <p-password 
                      formControlName="new_password_confirm"
                      [toggleMask]="true"
                      [feedback]="false"
                      styleClass="w-full"
                      inputStyleClass="w-full"
                      [class.ng-invalid]="passwordForm.hasError('passwordMismatch') && passwordForm.get('new_password_confirm')?.touched"
                    />
                    @if (passwordForm.hasError('passwordMismatch') && passwordForm.get('new_password_confirm')?.touched) {
                      <small class="text-red-500">Las contraseñas no coinciden</small>
                    }
                  </div>

                  <!-- Info Box -->
                  <div class="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                    <div class="flex items-start">
                      <i class="pi pi-info-circle text-blue-500 mr-3 mt-1"></i>
                      <div>
                        <p class="text-sm text-blue-700 font-medium">Requisitos de contraseña:</p>
                        <ul class="text-sm text-blue-600 mt-2 space-y-1">
                          <li>• Mínimo 8 caracteres</li>
                          <li>• Se recomienda incluir letras, números y símbolos</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <!-- Submit Button -->
                  <div class="flex justify-end gap-2 pt-4">
                    <p-button 
                      label="Cancelar" 
                      severity="secondary" 
                      [outlined]="true"
                      type="button"
                      (onClick)="passwordForm.reset()"
                    />
                    <p-button 
                      label="Cambiar Contraseña" 
                      icon="pi pi-lock"
                      type="submit"
                      [loading]="changingPassword()"
                      [disabled]="passwordForm.invalid"
                    />
                  </div>
                </div>
              </form>
            </p-card>
          </div>
        }

        <!-- Error State -->
        @if (!loading() && !profile()) {
          <p-card>
            <div class="text-center py-8">
              <i class="pi pi-exclamation-triangle text-6xl text-orange-500 mb-4"></i>
              <h3 class="text-xl font-semibold text-surface-900 mb-2">Error al Cargar Perfil</h3>
              <p class="text-surface-600 mb-4">No se pudo cargar la información de tu perfil.</p>
              <p-button 
                label="Reintentar" 
                icon="pi pi-refresh"
                (onClick)="loadProfile()"
              />
            </div>
          </p-card>
        }
      </div>
    </div>

    <p-toast />
  `
})
export class CustomerProfileComponent implements OnInit {
  private customerService = inject(CustomerService);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  profile = signal<CustomerProfile | null>(null);
  loading = signal(false);
  savingProfile = signal(false);
  changingPassword = signal(false);
  uploadingAvatar = signal(false);

  profileForm: FormGroup;
  passwordForm: FormGroup;

  constructor() {
    // Initialize profile form
    this.profileForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      phone: [''],
      address: [''],
      city: [''],
      country: [''],
      postal_code: ['']
    });

    // Initialize password form
    this.passwordForm = this.fb.group({
      old_password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(8)]],
      new_password_confirm: ['', Validators.required]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading.set(true);
    this.customerService.getProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.populateProfileForm(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el perfil. Por favor, intenta nuevamente.'
        });
      }
    });
  }

  populateProfileForm(profile: CustomerProfile): void {
    this.profileForm.patchValue({
      first_name: profile.user.first_name || '',
      last_name: profile.user.last_name || '',
      phone: profile.phone || '',
      address: profile.address || '',
      city: profile.city || '',
      country: profile.country || '',
      postal_code: profile.postal_code || ''
    });
  }

  updateProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.savingProfile.set(true);
    const updateData: UpdateProfileRequest = this.profileForm.value;

    this.customerService.updateProfile(updateData).subscribe({
      next: (data) => {
        this.profile.set(data);
        this.savingProfile.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Perfil actualizado correctamente'
        });
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.savingProfile.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.detail || 'No se pudo actualizar el perfil'
        });
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.changingPassword.set(true);
    const passwordData: ChangePasswordRequest = {
      old_password: this.passwordForm.value.old_password,
      new_password: this.passwordForm.value.new_password,
      new_password_confirm: this.passwordForm.value.new_password_confirm
    };

    this.customerService.changePassword(passwordData).subscribe({
      next: () => {
        this.changingPassword.set(false);
        this.passwordForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Contraseña cambiada correctamente'
        });
      },
      error: (error) => {
        console.error('Error changing password:', error);
        this.changingPassword.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.detail || error.error?.old_password?.[0] || 'No se pudo cambiar la contraseña'
        });
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('new_password');
    const confirmPassword = form.get('new_password_confirm');
    
    if (newPassword && confirmPassword && newPassword.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];

    // Validar tipo de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Formato no soportado. Use JPG, PNG, WEBP o GIF.'
      });
      return;
    }

    // Validar tamaño (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'El archivo es muy grande. Máximo 5MB.'
      });
      return;
    }

    this.uploadingAvatar.set(true);

    this.customerService.uploadAvatar(file).subscribe({
      next: (response) => {
        // Actualizar el perfil con la nueva URL del avatar
        const currentProfile = this.profile();
        if (currentProfile) {
          this.profile.set({
            ...currentProfile,
            avatar: response.avatar_url,
            avatar_s3_key: response.avatar_s3_key,
            avatar_s3_bucket: response.avatar_s3_bucket,
            user: {
              ...currentProfile.user,
              avatar: response.avatar_url,
              avatar_s3_key: response.avatar_s3_key,
              avatar_s3_bucket: response.avatar_s3_bucket
            }
          });
        }

        this.uploadingAvatar.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Avatar actualizado correctamente'
        });

        // Limpiar el input para permitir seleccionar el mismo archivo nuevamente
        input.value = '';
      },
      error: (error) => {
        console.error('Error uploading avatar:', error);
        this.uploadingAvatar.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || 'No se pudo subir el avatar'
        });
        input.value = '';
      }
    });
  }

  getInitials(): string {
    const profile = this.profile();
    if (!profile) return 'U';
    
    const firstName = profile.first_name || profile.user?.first_name || '';
    const lastName = profile.last_name || profile.user?.last_name || '';
    
    const firstInitial = firstName.charAt(0).toUpperCase();
    const lastInitial = lastName.charAt(0).toUpperCase();
    
    return firstInitial + lastInitial || 'U';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
