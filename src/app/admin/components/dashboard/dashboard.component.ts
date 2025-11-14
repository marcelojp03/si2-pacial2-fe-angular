import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { StatsCardComponent, type StatCardConfig } from '../../../shared/components/stats-card.component';
import { DashboardService } from './services/dashboard.service';
import type { DashboardStats, QuickAction } from './interfaces/dashboard.interface';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ToastModule,
    ButtonModule,
    CardModule,
    StatsCardComponent
  ],
  providers: [MessageService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  private service = inject(DashboardService);
  private messageService = inject(MessageService);
  private router = inject(Router);

  // Signals
  stats = signal<DashboardStats | null>(null);
  loading = signal<boolean>(false);

  // Computed
  statsCards = computed<StatCardConfig[]>(() => {
    const data = this.stats();
    if (!data) return [];

    return [
      {
        label: 'Ventas Hoy',
        value: `$${data.todaySales.toLocaleString()}`,
        icon: 'pi-dollar',
        color: 'blue'
      },
      {
        label: 'Pedidos Pendientes',
        value: data.pendingOrders.toString(),
        icon: 'pi-shopping-cart',
        color: 'orange'
      },
      {
        label: 'Stock Bajo',
        value: data.lowStock.toString(),
        icon: 'pi-exclamation-triangle',
        color: 'red'
      },
      {
        label: 'Nuevos Clientes',
        value: data.newCustomers.toString(),
        icon: 'pi-users',
        color: 'green'
      }
    ];
  });

  quickActions: QuickAction[] = [
    {
      label: 'Nuevo Pedido',
      icon: 'pi-plus-circle',
      color: 'blue',
      route: '/admin/sales/orders'
    },
    {
      label: 'Agregar Producto',
      icon: 'pi-box',
      color: 'green',
      route: '/admin/catalog/products'
    },
    {
      label: 'Ver Inventario',
      icon: 'pi-database',
      color: 'purple',
      route: '/admin/inventory/stock'
    },
    {
      label: 'Reportes IA',
      icon: 'pi-sparkles',
      color: 'cyan',
      route: '/admin/analytics/ai-reports'
    }
  ];

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.service.getDashboardStats().subscribe({
      next: (response) => {
        this.stats.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading dashboard:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo cargar el dashboard',
          life: 3000
        });
        this.loading.set(false);
      }
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  getColorClass(color: string): string {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500 hover:bg-blue-600',
      green: 'bg-green-500 hover:bg-green-600',
      purple: 'bg-purple-500 hover:bg-purple-600',
      cyan: 'bg-cyan-500 hover:bg-cyan-600',
      orange: 'bg-orange-500 hover:bg-orange-600',
      red: 'bg-red-500 hover:bg-red-600'
    };
    return colors[color] || 'bg-blue-500 hover:bg-blue-600';
  }
}
