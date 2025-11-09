import { Component, OnInit, signal, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService } from 'primeng/api';
import { DashboardHomeService } from './services/dashboard-home.service';
import { SubscriptionService } from '../subscription/subscription.service';
import { ApiService } from '../../../core/services/api.service';
import { StatsWidget } from './components/statswidget';
import { StockAlertsWidget } from './components/stockalertswidget';
import type { DashboardStats, StockAlert } from './interfaces/dashboard.interface';
import type { SalesDashboard } from '../../../core/models';

interface SubscriptionData {
  plan: {
    name: string;
    code: string;
  };
  subscription: {
    status: string;
    is_trial: boolean;
  };
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SharedModule,
    StatsWidget,
    StockAlertsWidget
  ],
  providers: [MessageService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  private dashboardService = inject(DashboardHomeService);
  private subscriptionService = inject(SubscriptionService);
  private api = inject(ApiService);
  private messageService = inject(MessageService);

  // Signals
  stats = signal<DashboardStats | null>(null);
  stockAlerts = signal<StockAlert[]>([]);
  subscription = signal<SubscriptionData | null>(null);
  salesDashboard = signal<SalesDashboard | null>(null);
  loading = signal<boolean>(false);

  ngOnInit(): void {
    this.loadDashboard();
    this.loadSalesDashboard();
  }

  loadSalesDashboard(): void {
    // Cargar dashboard de ventas desde la API de ecommerce
    this.api.getSalesDashboard(30).subscribe({
      next: (data: SalesDashboard) => {
        this.salesDashboard.set(data);
      },
      error: (err: any) => {
        console.error('Error loading sales dashboard:', err);
      }
    });
  }

  loadDashboard(): void {
    this.loading.set(true);

    // Load KPIs - ahora retorna DashboardStats directamente
    this.dashboardService.getKPIs().subscribe({
      next: (stats: DashboardStats) => {
        this.stats.set(stats);
      },
      error: (err: any) => {
        console.error('Error loading KPIs:', err);
        // Solo mostrar error si no es 401 (ya manejado por interceptor)
        if (err.status !== 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las estadísticas',
            life: 3000
          });
        }
      }
    });

    // Load Alerts
    this.dashboardService.getStockAlerts().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.stockAlerts.set(response.data);
        }
      },
      error: (err: any) => {
        console.error('Error loading alerts:', err);
        // Solo mostrar error si no es 401 (ya manejado por interceptor)
        if (err.status !== 401) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'No se pudieron cargar las alertas',
            life: 3000
          });
        }
      }
    });

    // Load Subscription (optional - may not be available)
    this.subscriptionService.getSubscription().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.subscription.set(response.data);
        }
        this.loading.set(false);
      },
      error: (err: any) => {
        // 404 es esperado si el endpoint no existe aún
        if (err.status === 404) {
          console.warn('Subscription endpoint not available (404)');
          // Set default free plan
          this.subscription.set({
            plan: {
              name: 'Free',
              code: 'free'
            },
            subscription: {
              status: 'trial',
              is_trial: true
            }
          });
        } else if (err.status !== 401) {
          console.error('Error loading subscription:', err);
        }
        this.loading.set(false);
      }
    });
  }
}
