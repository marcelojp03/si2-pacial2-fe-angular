// Forecasting Component - Patrón B (Analytics)
import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface Forecast {
  productId: number;
  productName: string;
  currentStock: number;
  predictedDemand: number;
  recommendedOrder: number;
  confidence: number;
}

@Component({
  selector: 'app-forecasting',
  standalone: true,
  imports: [CommonModule, TableModule, ButtonModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <div class="card">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/20">
                <i class="pi pi-chart-line text-3xl text-purple-600 dark:text-purple-400"></i>
              </div>
              <div>
                <h1 class="mb-1 text-2xl font-bold">Predicciones de Demanda</h1>
                <p class="text-surface-600 dark:text-surface-400">Pronóstico de ventas con IA</p>
              </div>
            </div>
            <p-button icon="pi pi-refresh" [rounded]="true" [outlined]="true" severity="secondary" (onClick)="loadData()" [loading]="loading()" />
          </div>
        </div>
      </div>

      <div class="col-span-12">
        <div class="card">
          <p-table [value]="forecasts()" [rows]="10" [paginator]="true" [loading]="loading()">
            <ng-template #header>
              <tr>
                <th>Producto</th>
                <th>Stock Actual</th>
                <th>Demanda Predicha</th>
                <th>Pedido Recomendado</th>
                <th>Confianza</th>
              </tr>
            </ng-template>
            <ng-template #body let-forecast>
              <tr>
                <td><span class="font-semibold">{{forecast.productName}}</span></td>
                <td>{{forecast.currentStock}}</td>
                <td><span class="text-blue-600">{{forecast.predictedDemand}}</span></td>
                <td><span class="font-semibold text-green-600">{{forecast.recommendedOrder}}</span></td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="h-2 w-24 bg-surface-200 rounded-full overflow-hidden">
                      <div class="h-full bg-green-500" [style.width.%]="forecast.confidence"></div>
                    </div>
                    <span class="text-sm">{{forecast.confidence}}%</span>
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
  `
})
export class ForecastingComponent implements OnInit {
  private messageService = inject(MessageService);

  forecasts = signal<Forecast[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.forecasts.set([
        { productId: 1, productName: 'Laptop Dell', currentStock: 15, predictedDemand: 25, recommendedOrder: 10, confidence: 85 },
        { productId: 2, productName: 'Mouse Logitech', currentStock: 50, predictedDemand: 80, recommendedOrder: 30, confidence: 92 }
      ]);
      this.loading.set(false);
    }, 500);
  }
}
