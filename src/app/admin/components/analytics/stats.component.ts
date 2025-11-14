// Stats Component - Patrón B (Analytics)
import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface StatData {
  label: string;
  value: string;
  change: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, ToastModule],
  providers: [MessageService],
  template: `
    <p-toast />
    <div class="grid grid-cols-12 gap-6">
      <div class="col-span-12">
        <div class="card">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="flex h-14 w-14 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/20">
                <i class="pi pi-chart-bar text-3xl text-cyan-600 dark:text-cyan-400"></i>
              </div>
              <div>
                <h1 class="mb-1 text-2xl font-bold">Estadísticas del Sistema</h1>
                <p class="text-surface-600 dark:text-surface-400">Métricas generales y KPIs</p>
              </div>
            </div>
            <p-button icon="pi pi-refresh" [rounded]="true" [outlined]="true" severity="secondary" (onClick)="loadData()" [loading]="loading()" />
          </div>
        </div>
      </div>

      @for (stat of stats(); track stat.label) {
        <div class="col-span-12 md:col-span-6 lg:col-span-3">
          <div class="card bg-{{stat.color}}-50 dark:bg-{{stat.color}}-900/20">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-surface-600 dark:text-surface-400 mb-1">{{stat.label}}</p>
                <h3 class="text-2xl font-bold text-surface-900 dark:text-surface-0">{{stat.value}}</h3>
                <p class="text-xs mt-2" [class]="stat.change >= 0 ? 'text-green-600' : 'text-red-600'">
                  <i class="pi" [class]="stat.change >= 0 ? 'pi-arrow-up' : 'pi-arrow-down'"></i>
                  {{stat.change >= 0 ? '+' : ''}}{{stat.change}}% vs mes anterior
                </p>
              </div>
              <div class="flex h-12 w-12 items-center justify-center rounded-full bg-{{stat.color}}-100 dark:bg-{{stat.color}}-400/10">
                <i class="pi {{stat.icon}} text-2xl text-{{stat.color}}-600 dark:text-{{stat.color}}-400"></i>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class StatsComponent implements OnInit {
  private messageService = inject(MessageService);

  stats = signal<StatData[]>([]);
  loading = signal(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    setTimeout(() => {
      this.stats.set([
        { label: 'Ventas Totales', value: '$125,430', change: 12.5, icon: 'pi-dollar', color: 'blue' },
        { label: 'Pedidos', value: '1,245', change: 8.2, icon: 'pi-shopping-cart', color: 'green' },
        { label: 'Productos', value: '456', change: 3.1, icon: 'pi-box', color: 'purple' },
        { label: 'Clientes', value: '892', change: 15.7, icon: 'pi-users', color: 'cyan' }
      ]);
      this.loading.set(false);
    }, 500);
  }
}
