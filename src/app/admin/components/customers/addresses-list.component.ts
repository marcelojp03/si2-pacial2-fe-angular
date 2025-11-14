// Customer Addresses Component - Patrón A (CRUD)
import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';

interface Address {
  id?: number;
  customerId: number;
  customerName?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

@Component({
  selector: 'app-addresses-list',
  standalone: true,
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, ToolbarModule, ToastModule, TagModule, InputTextModule, ConfirmDialogModule],
  providers: [MessageService, ConfirmationService],
  template: `
    <p-toast />
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <div class="card">
          <div class="flex items-center gap-4">
            <div class="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/20">
              <i class="pi pi-map-marker text-3xl text-cyan-600 dark:text-cyan-400"></i>
            </div>
            <div>
              <h1 class="mb-1 text-2xl font-bold">Direcciones</h1>
              <p class="text-surface-600 dark:text-surface-400">Direcciones de clientes</p>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12">
        <div class="card">
          <p-toolbar styleClass="mb-6 gap-2">
            <ng-template #start>
              <p-button label="Nueva Dirección" icon="pi pi-plus" severity="primary" (onClick)="openNew()" />
            </ng-template>
          </p-toolbar>

          <p-table [value]="addresses()" [rows]="10" [paginator]="true" [loading]="loading()">
            <ng-template #header>
              <tr>
                <th>Cliente</th>
                <th>Dirección</th>
                <th>Ciudad</th>
                <th>Estado</th>
                <th>País</th>
                <th>Predeterminada</th>
                <th>Acciones</th>
              </tr>
            </ng-template>
            <ng-template #body let-address>
              <tr>
                <td>{{address.customerName}}</td>
                <td>{{address.street}}</td>
                <td>{{address.city}}</td>
                <td>{{address.state}}</td>
                <td>{{address.country}}</td>
                <td><i class="pi" [ngClass]="address.isDefault ? 'pi-check text-green-500' : 'pi-times text-gray-400'"></i></td>
                <td>
                  <div class="flex gap-2">
                    <p-button icon="pi pi-pencil" [rounded]="true" [outlined]="true" severity="secondary" size="small" (onClick)="edit(address)" />
                    <p-button icon="pi pi-trash" [rounded]="true" [outlined]="true" severity="danger" size="small" (onClick)="delete(address)" />
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>

    <p-dialog [(visible)]="dialog" [style]="{ width: '650px' }" [header]="current().id ? 'Editar Dirección' : 'Nueva Dirección'" [modal]="true">
      <ng-template #content>
        <div class="flex flex-col gap-4">
          <input pInputText [(ngModel)]="current().street" placeholder="Calle" [fluid]="true" />
          <div class="grid grid-cols-2 gap-4">
            <input pInputText [(ngModel)]="current().city" placeholder="Ciudad" [fluid]="true" />
            <input pInputText [(ngModel)]="current().state" placeholder="Estado" [fluid]="true" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <input pInputText [(ngModel)]="current().zipCode" placeholder="CP" [fluid]="true" />
            <input pInputText [(ngModel)]="current().country" placeholder="País" [fluid]="true" />
          </div>
        </div>
      </ng-template>
      <ng-template #footer>
        <p-button label="Cancelar" icon="pi pi-times" [outlined]="true" (onClick)="hideDialog()" />
        <p-button label="Guardar" icon="pi pi-check" (onClick)="save()" />
      </ng-template>
    </p-dialog>

    <p-confirmdialog />
  `
})
export class AddressesListComponent implements OnInit {
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  addresses = signal<Address[]>([]);
  loading = signal(false);
  dialog = signal(false);
  current = signal<Address>({} as Address);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.addresses.set([
        { id: 1, customerId: 1, customerName: 'Juan Pérez', street: 'Av. Principal 123', city: 'Santa Cruz', state: 'SC', zipCode: '0000', country: 'Bolivia', isDefault: true }
      ]);
      this.loading.set(false);
    }, 500);
  }

  openNew(): void {
    this.current.set({ street: '', city: '', state: '', zipCode: '', country: 'Bolivia', customerId: 0, isDefault: false });
    this.dialog.set(true);
  }

  edit(address: Address): void {
    this.current.set({ ...address });
    this.dialog.set(true);
  }

  delete(address: Address): void {
    this.confirmationService.confirm({
      message: '¿Eliminar esta dirección?',
      accept: () => {
        this.addresses.update(items => items.filter(i => i.id !== address.id));
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Dirección eliminada' });
      }
    });
  }

  save(): void {
    if (this.current().id) {
      this.addresses.update(items => items.map(i => i.id === this.current().id ? this.current() : i));
    } else {
      this.addresses.update(items => [...items, { ...this.current(), id: Date.now() }]);
    }
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Dirección guardada' });
    this.hideDialog();
  }

  hideDialog(): void {
    this.dialog.set(false);
  }
}
