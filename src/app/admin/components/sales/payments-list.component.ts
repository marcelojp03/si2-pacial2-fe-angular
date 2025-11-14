// Payments Component - Patrón B (Read-Only)
import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { StatsCardComponent, type StatCardConfig } from '../../../shared/components/stats-card.component';

interface Payment {
  id: number;
  orderId: number;
  amount: number;
  method: string;
  status: string;
  transactionId?: string;
  createdAt: Date;
}

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule, StatsCardComponent],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <div class="card">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <i class="pi pi-dollar text-3xl text-green-600 dark:text-green-400"></i>
              </div>
              <div>
                <h1 class="mb-1 text-2xl font-bold">Pagos</h1>
                <p class="text-surface-600 dark:text-surface-400">Registro de transacciones</p>
              </div>
            </div>
            <p-button icon="pi pi-refresh" [rounded]="true" [outlined]="true" severity="secondary" (onClick)="loadData()" [loading]="loading()" />
          </div>
        </div>
      </div>

      @for (stat of statsCards(); track stat.label) {
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
          <app-stats-card [config]="stat" />
        </div>
      }

      <div class="col-span-12">
        <div class="card">
          <p-table [value]="payments()" [rows]="10" [paginator]="true" [loading]="loading()">
            <ng-template #header>
              <tr>
                <th>ID Pedido</th>
                <th>Monto</th>
                <th>Método</th>
                <th>Estado</th>
                <th>Fecha</th>
              </tr>
            </ng-template>
            <ng-template #body let-payment>
              <tr>
                <td>{{payment.orderId}}</td>
                <td>\${{payment.amount.toFixed(2)}}</td>
                <td>{{payment.method}}</td>
                <td><p-tag [value]="payment.status" [severity]="payment.status === 'completed' ? 'success' : 'warn'" /></td>
                <td>{{payment.createdAt | date:'short'}}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
  `
})
export class PaymentsListComponent implements OnInit {
  private messageService = inject(MessageService);

  payments = signal<Payment[]>([]);
  loading = signal(false);

  statsCards = computed<StatCardConfig[]>(() => {
    const data = this.payments();
    const total = data.reduce((sum, p) => sum + p.amount, 0);
    const completed = data.filter(p => p.status === 'completed').length;

    return [
      { label: 'Total Recaudado', value: `$${total.toFixed(2)}`, icon: 'pi-dollar', color: 'green' },
      { label: 'Pagos Completados', value: completed.toString(), icon: 'pi-check-circle', color: 'blue' },
      { label: 'Pendientes', value: (data.length - completed).toString(), icon: 'pi-clock', color: 'orange' },
      { label: 'Total Pagos', value: data.length.toString(), icon: 'pi-list', color: 'purple' }
    ];
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    // Simulated data
    setTimeout(() => {
      this.payments.set([
        { id: 1, orderId: 1001, amount: 250.00, method: 'VPAY', status: 'completed', createdAt: new Date() }
      ]);
      this.loading.set(false);
    }, 500);
  }
}
