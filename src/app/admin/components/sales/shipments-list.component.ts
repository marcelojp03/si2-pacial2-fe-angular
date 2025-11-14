// Shipments Component - Patrón B (Read-Only)
import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { StatsCardComponent, type StatCardConfig } from '../../../shared/components/stats-card.component';

interface Shipment {
  id: number;
  orderId: number;
  trackingCode: string;
  carrier: string;
  status: string;
  shippedAt?: Date;
  deliveredAt?: Date;
}

@Component({
  selector: 'app-shipments-list',
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
              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20">
                <i class="pi pi-send text-3xl text-blue-600 dark:text-blue-400"></i>
              </div>
              <div>
                <h1 class="mb-1 text-2xl font-bold">Envíos</h1>
                <p class="text-surface-600 dark:text-surface-400">Seguimiento de entregas</p>
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
          <p-table [value]="shipments()" [rows]="10" [paginator]="true" [loading]="loading()">
            <ng-template #header>
              <tr>
                <th>Código Rastreo</th>
                <th>Pedido</th>
                <th>Transportista</th>
                <th>Estado</th>
                <th>Fecha Envío</th>
              </tr>
            </ng-template>
            <ng-template #body let-shipment>
              <tr>
                <td><code class="font-mono">{{shipment.trackingCode}}</code></td>
                <td>#{{shipment.orderId}}</td>
                <td>{{shipment.carrier}}</td>
                <td><p-tag [value]="shipment.status" [severity]="shipment.status === 'delivered' ? 'success' : 'info'" /></td>
                <td>{{shipment.shippedAt | date:'short'}}</td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
  `
})
export class ShipmentsListComponent implements OnInit {
  private messageService = inject(MessageService);

  shipments = signal<Shipment[]>([]);
  loading = signal(false);

  statsCards = computed<StatCardConfig[]>(() => {
    const data = this.shipments();
    const delivered = data.filter(s => s.status === 'delivered').length;
    const inTransit = data.filter(s => s.status === 'in_transit').length;

    return [
      { label: 'Total Envíos', value: data.length.toString(), icon: 'pi-box', color: 'blue' },
      { label: 'Entregados', value: delivered.toString(), icon: 'pi-check', color: 'green' },
      { label: 'En Tránsito', value: inTransit.toString(), icon: 'pi-truck', color: 'orange' },
      { label: 'Pendientes', value: (data.length - delivered - inTransit).toString(), icon: 'pi-clock', color: 'red' }
    ];
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.shipments.set([
        { id: 1, orderId: 1001, trackingCode: 'TRK123456', carrier: 'DHL', status: 'in_transit', shippedAt: new Date() }
      ]);
      this.loading.set(false);
    }, 500);
  }
}
