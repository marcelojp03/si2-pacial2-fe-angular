import { Component, inject, OnInit, signal, computed, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { StatsCardComponent, type StatCardConfig } from '../../../shared/components/stats-card.component';
import type { Customer } from './interfaces/customer.interface';
import { CustomersService } from './services/customers.service';

@Component({
  selector: 'app-customers-list',
  standalone: true,
  imports: [
    SharedModule,
    StatsCardComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './customers-list.component.html'
})
export class CustomersListComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  private customersService = inject(CustomersService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  customers = signal<Customer[]>([]);
  loading = signal(false);
  totalCustomers = signal(0);
  selectedCustomers = signal<Customer[]>([]);
  
  customerDialog = false;
  submitted = signal(false);
  currentCustomer = signal<Customer | null>(null);
  
  customerForm: FormGroup;

  // Stats cards
  statsCards = computed<StatCardConfig[]>(() => {
    const all = this.customers();
    const active = all.filter(c => c.is_active).length;
    const business = all.filter(c => c.customer_type === 'BUSINESS').length;
    const individual = all.filter(c => c.customer_type === 'INDIVIDUAL').length;

    return [
      {
        label: 'Total Clientes',
        value: this.totalCustomers().toString(),
        icon: 'pi pi-users',
        color: 'blue'
      },
      {
        label: 'Activos',
        value: active.toString(),
        icon: 'pi pi-check-circle',
        color: 'green'
      },
      {
        label: 'Empresas',
        value: business.toString(),
        icon: 'pi pi-building',
        color: 'purple'
      },
      {
        label: 'Individuales',
        value: individual.toString(),
        icon: 'pi pi-user',
        color: 'cyan'
      }
    ];
  });

  constructor() {
    this.customerForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      company_name: [''],
      customer_type: ['INDIVIDUAL', Validators.required],
      is_active: [true]
    });
  }

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers(event?: any) {
    this.loading.set(true);

    const params: any = {
      page: event ? (event.first / event.rows) + 1 : 1,
      page_size: event?.rows || 10
    };

    this.customersService.listCustomers(params).subscribe({
      next: (res: any) => {
        this.customers.set(res.results);
        this.totalCustomers.set(res.count);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading customers:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los clientes'
        });
        this.loading.set(false);
        this.customers.set([]);
      }
    });
  }

  openNew() {
    this.currentCustomer.set(null);
    this.submitted.set(false);
    this.customerForm.reset({ 
      customer_type: 'INDIVIDUAL',
      is_active: true 
    });
    this.customerDialog = true;
  }

  editCustomer(customer: Customer) {
    this.currentCustomer.set(customer);
    this.customerForm.patchValue({
      first_name: customer.first_name,
      last_name: customer.last_name,
      email: customer.email,
      phone: customer.phone,
      company_name: customer.company_name,
      customer_type: (customer as any).customer_type || 'INDIVIDUAL',
      is_active: customer.is_active
    });
    this.customerDialog = true;
  }

  hideDialog() {
    this.customerDialog = false;
    this.submitted.set(false);
    this.customerForm.reset({ 
      customer_type: 'INDIVIDUAL',
      is_active: true 
    });
  }

  saveCustomer() {
    this.submitted.set(true);

    if (this.customerForm.invalid) {
      return;
    }

    const customerData = this.customerForm.value;

    const request$ = this.currentCustomer()
      ? this.customersService.updateCustomer(this.currentCustomer()!.id, customerData)
      : this.customersService.createCustomer(customerData);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.currentCustomer() 
            ? 'Cliente actualizado correctamente' 
            : 'Cliente creado correctamente'
        });
        this.loadCustomers();
        this.hideDialog();
      },
      error: (err: any) => {
        console.error('Error saving customer:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar el cliente'
        });
      }
    });
  }

  deleteCustomer(customer: Customer) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar al cliente ${customer.first_name} ${customer.last_name}?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.customersService.deleteCustomer(customer.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Cliente eliminado correctamente'
            });
            this.loadCustomers();
          },
          error: (err: any) => {
            console.error('Error deleting customer:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar el cliente'
            });
          }
        });
      }
    });
  }

  deleteSelectedCustomers() {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar ${this.selectedCustomers().length} clientes?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        // Aquí implementarías la eliminación múltiple si tu API lo soporta
        this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'Eliminación múltiple no implementada'
        });
      }
    });
  }

  exportCSV() {
    this.table.exportCSV();
  }

  onGlobalFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.table.filterGlobal(value, 'contains');
  }

  getInitials(firstName: string, lastName: string): string {
    const first = firstName?.charAt(0)?.toUpperCase() || '';
    const last = lastName?.charAt(0)?.toUpperCase() || '';
    return first + last;
  }
}

