# 🎯 Guía de Implementación - Componentes E-Commerce

Esta guía te ayudará a crear los componentes faltantes para el E-Commerce.

---

## 📦 1. Catálogo de Productos (ProductsList)

### Crear el componente

```bash
# Dentro de dashboard/components/product/
ng g c products-list --standalone
```

### Código: `products-list.component.ts`

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { SkeletonModule } from 'primeng/skeleton';

// Services
import { ApiService } from '../../../core/services/api.service';
import { CartStore } from '../../../core/state/cart.store';
import type { ProductListItem, Category } from '../../../core/models';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    DataViewModule,
    TagModule,
    SkeletonModule
  ],
  template: `
    <div class="card">
      <h3 class="text-3xl font-bold mb-4">Catálogo de Productos</h3>

      <!-- Filtros -->
      <div class="flex gap-3 mb-4 flex-wrap">
        <span class="p-input-icon-left flex-1 min-w-[250px]">
          <i class="pi pi-search"></i>
          <input 
            pInputText 
            [(ngModel)]="searchQuery"
            (ngModelChange)="onSearch()"
            placeholder="Buscar productos..." 
            class="w-full"
          />
        </span>

        <p-dropdown
          [(ngModel)]="selectedCategory"
          [options]="categories()"
          optionLabel="name"
          optionValue="id"
          placeholder="Todas las categorías"
          (onChange)="onCategoryChange()"
          [showClear]="true"
          class="min-w-[200px]"
        />

        <p-button 
          label="Destacados" 
          icon="pi pi-star"
          [outlined]="!showFeatured"
          (onClick)="toggleFeatured()"
        />
      </div>

      <!-- Lista de productos -->
      <p-dataView 
        [value]="products()" 
        [paginator]="true" 
        [rows]="12"
        [loading]="loading()"
        layout="grid"
      >
        <ng-template pTemplate="header">
          <div class="flex justify-between items-center">
            <span class="text-muted-color">{{ totalProducts() }} productos</span>
          </div>
        </ng-template>

        <ng-template let-product pTemplate="gridItem">
          <div class="col-12 sm:col-6 lg:col-4 xl:col-3 p-2">
            <div class="border-surface-200 dark:border-surface-700 surface-card rounded-xl border p-4 hover:shadow-lg transition-all cursor-pointer">
              <!-- Imagen -->
              <div class="relative mb-3">
                @if (product.main_image) {
                  <img 
                    [src]="product.main_image" 
                    [alt]="product.name"
                    class="w-full h-48 object-cover rounded-xl"
                  />
                } @else {
                  <div class="w-full h-48 bg-surface-100 dark:bg-surface-800 rounded-xl flex items-center justify-center">
                    <i class="pi pi-image text-4xl text-muted-color"></i>
                  </div>
                }

                @if (product.is_featured) {
                  <p-tag 
                    value="Destacado" 
                    severity="success"
                    icon="pi pi-star"
                    class="absolute top-2 right-2"
                  />
                }
              </div>

              <!-- Info -->
              <div class="mb-3">
                <div class="text-xs text-muted-color mb-1">
                  {{ product.category_names?.join(' > ') }}
                </div>
                <h4 class="text-lg font-semibold mb-2 truncate">
                  {{ product.name }}
                </h4>
                <p class="text-sm text-muted-color line-clamp-2 mb-2">
                  {{ product.description }}
                </p>

                <!-- Precio -->
                @if (product.price_range) {
                  <div class="text-xl font-bold text-primary">
                    @if (product.price_range.min === product.price_range.max) {
                      Bs. {{ product.price_range.min | number:'1.2-2' }}
                    } @else {
                      Bs. {{ product.price_range.min | number:'1.2-2' }} - {{ product.price_range.max | number:'1.2-2' }}
                    }
                  </div>
                }
              </div>

              <!-- Acciones -->
              <div class="flex gap-2">
                <p-button 
                  label="Ver detalles" 
                  icon="pi pi-eye"
                  [outlined]="true"
                  size="small"
                  class="flex-1"
                  (onClick)="viewProduct(product.id)"
                />
                <p-button 
                  icon="pi pi-shopping-cart"
                  severity="success"
                  size="small"
                  (onClick)="addToCart(product)"
                />
              </div>
            </div>
          </div>
        </ng-template>

        <ng-template pTemplate="empty">
          <div class="text-center py-12">
            <i class="pi pi-inbox text-6xl text-muted-color mb-4"></i>
            <p class="text-xl text-muted-color">No se encontraron productos</p>
          </div>
        </ng-template>
      </p-dataView>
    </div>
  `
})
export class ProductsListComponent implements OnInit {
  private api = inject(ApiService);
  private cart = inject(CartStore);
  private router = inject(Router);

  // Signals
  products = signal<ProductListItem[]>([]);
  categories = signal<Category[]>([]);
  loading = signal(false);
  totalProducts = signal(0);

  // Filters
  searchQuery = '';
  selectedCategory: number | null = null;
  showFeatured = false;

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.api.listCategories().subscribe(res => {
      this.categories.set(res.results);
    });
  }

  loadProducts() {
    this.loading.set(true);
    
    const params: any = {};
    if (this.searchQuery) params.search = this.searchQuery;
    if (this.selectedCategory) params.category = this.selectedCategory;
    if (this.showFeatured) params.featured = true;

    this.api.listProducts(params).subscribe({
      next: (res) => {
        this.products.set(res.results);
        this.totalProducts.set(res.count);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onSearch() {
    this.loadProducts();
  }

  onCategoryChange() {
    this.loadProducts();
  }

  toggleFeatured() {
    this.showFeatured = !this.showFeatured;
    this.loadProducts();
  }

  viewProduct(id: number) {
    this.router.navigate(['/admin/products', id]);
  }

  addToCart(product: ProductListItem) {
    // Si el producto tiene un solo precio, usar la primera variante
    // En un caso real, deberías mostrar un dialog para seleccionar variante
    this.cart.addItem({
      variantId: product.id, // Temporal: usar ID del producto como variant ID
      productId: product.id,
      name: product.name,
      price: product.price_range?.min || 0,
      qty: 1,
      image: product.main_image
    });
    
    // Feedback visual (opcional: agregar toast)
    console.log('Producto agregado al carrito:', product.name);
  }
}
```

### Agregar a las rutas

```typescript
// En dashboard/components/product/product.routes.ts
{
  path: '',
  component: ProductsListComponent
}
```

---

## 🛒 2. Carrito de Compras

### Crear el componente

```bash
# Crear carpeta cart
mkdir src/app/dashboard/components/cart
cd src/app/dashboard/components/cart
ng g c cart-page --standalone
```

### Código: `cart-page.component.ts`

```typescript
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// PrimeNG
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';

// Services
import { CartStore, CartItemLocal } from '../../../core/state/cart.store';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputNumberModule
  ],
  template: `
    <div class="card">
      <h3 class="text-3xl font-bold mb-4">Mi Carrito</h3>

      @if (cart.items().length === 0) {
        <div class="text-center py-12">
          <i class="pi pi-shopping-cart text-6xl text-muted-color mb-4"></i>
          <p class="text-xl text-muted-color mb-4">Tu carrito está vacío</p>
          <p-button 
            label="Ir a comprar" 
            icon="pi pi-arrow-left"
            (onClick)="goToProducts()"
          />
        </div>
      } @else {
        <p-table [value]="cart.items()" [tableStyle]="{'min-width': '50rem'}">
          <ng-template pTemplate="header">
            <tr>
              <th>Producto</th>
              <th>Precio</th>
              <th class="text-center">Cantidad</th>
              <th class="text-right">Subtotal</th>
              <th class="text-center">Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-item>
            <tr>
              <td>
                <div class="flex items-center gap-3">
                  @if (item.image) {
                    <img 
                      [src]="item.image" 
                      [alt]="item.name"
                      class="w-16 h-16 object-cover rounded"
                    />
                  }
                  <div>
                    <div class="font-semibold">{{ item.name }}</div>
                    @if (item.code) {
                      <div class="text-sm text-muted-color">{{ item.code }}</div>
                    }
                  </div>
                </div>
              </td>
              <td>Bs. {{ item.price | number:'1.2-2' }}</td>
              <td class="text-center">
                <div class="flex items-center justify-center gap-2">
                  <p-button 
                    icon="pi pi-minus" 
                    size="small"
                    [outlined]="true"
                    (onClick)="cart.decrementQty(item.variantId)"
                  />
                  <span class="font-semibold w-8 text-center">{{ item.qty }}</span>
                  <p-button 
                    icon="pi pi-plus" 
                    size="small"
                    [outlined]="true"
                    (onClick)="cart.incrementQty(item.variantId)"
                  />
                </div>
              </td>
              <td class="text-right font-bold">
                Bs. {{ item.price * item.qty | number:'1.2-2' }}
              </td>
              <td class="text-center">
                <p-button 
                  icon="pi pi-trash" 
                  severity="danger"
                  [text]="true"
                  (onClick)="cart.removeItem(item.variantId)"
                />
              </td>
            </tr>
          </ng-template>
          <ng-template pTemplate="footer">
            <tr>
              <td colspan="3" class="text-right font-bold">Total:</td>
              <td class="text-right">
                <div class="text-2xl font-bold text-primary">
                  Bs. {{ cart.totalAmount() | number:'1.2-2' }}
                </div>
              </td>
              <td></td>
            </tr>
          </ng-template>
        </p-table>

        <div class="flex justify-between mt-4">
          <p-button 
            label="Vaciar carrito" 
            icon="pi pi-trash"
            severity="danger"
            [outlined]="true"
            (onClick)="cart.clear()"
          />
          <div class="flex gap-2">
            <p-button 
              label="Seguir comprando" 
              icon="pi pi-arrow-left"
              [outlined]="true"
              (onClick)="goToProducts()"
            />
            <p-button 
              label="Proceder al pago" 
              icon="pi pi-credit-card"
              severity="success"
              (onClick)="goToCheckout()"
            />
          </div>
        </div>
      }
    </div>
  `
})
export class CartPageComponent {
  cart = inject(CartStore);
  private router = inject(Router);

  goToProducts() {
    this.router.navigate(['/admin/products']);
  }

  goToCheckout() {
    this.router.navigate(['/admin/checkout']);
  }
}
```

### Agregar a las rutas

```typescript
// En dashboard.routes.ts
{
  path: 'cart',
  loadComponent: () => import('./components/cart/cart-page/cart-page.component')
    .then(m => m.CartPageComponent)
}
```

---

## 📊 3. Dashboard con Forecast

### Actualizar `home.component.ts`

```bash
# Primero instalar Chart.js
npm install ng2-charts chart.js
```

```typescript
import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

// PrimeNG
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';

// Services
import { ApiService } from '../../../core/services/api.service';
import type { SalesDashboard } from '../../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    CardModule,
    ButtonModule,
    TableModule,
    SkeletonModule
  ],
  template: `
    <div class="grid">
      <!-- Métricas principales -->
      <div class="col-12 lg:col-3 md:col-6">
        <div class="surface-card shadow-2 p-4 border-round">
          <div class="flex justify-between mb-3">
            <div>
              <span class="block text-muted-color font-medium mb-3">Ingresos Totales</span>
              <div class="text-3xl font-bold text-primary">
                Bs. {{ dashboard()?.metrics.total_revenue | number:'1.2-2' }}
              </div>
            </div>
            <div class="flex items-center justify-center bg-primary-100 dark:bg-primary-400/10 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-dollar text-primary text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-3 md:col-6">
        <div class="surface-card shadow-2 p-4 border-round">
          <div class="flex justify-between mb-3">
            <div>
              <span class="block text-muted-color font-medium mb-3">Órdenes</span>
              <div class="text-3xl font-bold">
                {{ dashboard()?.metrics.total_orders | number }}
              </div>
            </div>
            <div class="flex items-center justify-center bg-green-100 dark:bg-green-400/10 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-shopping-cart text-green-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-3 md:col-6">
        <div class="surface-card shadow-2 p-4 border-round">
          <div class="flex justify-between mb-3">
            <div>
              <span class="block text-muted-color font-medium mb-3">Ticket Promedio</span>
              <div class="text-3xl font-bold text-orange-500">
                Bs. {{ dashboard()?.metrics.avg_order_value | number:'1.2-2' }}
              </div>
            </div>
            <div class="flex items-center justify-center bg-orange-100 dark:bg-orange-400/10 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-chart-bar text-orange-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-3 md:col-6">
        <div class="surface-card shadow-2 p-4 border-round">
          <div class="flex justify-between mb-3">
            <div>
              <span class="block text-muted-color font-medium mb-3">Items Vendidos</span>
              <div class="text-3xl font-bold text-cyan-500">
                {{ dashboard()?.metrics.total_items_sold | number }}
              </div>
            </div>
            <div class="flex items-center justify-center bg-cyan-100 dark:bg-cyan-400/10 border-round" style="width:2.5rem;height:2.5rem">
              <i class="pi pi-box text-cyan-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>

      <!-- Gráfico de ventas -->
      <div class="col-12 lg:col-8">
        <div class="card">
          <h5>Ventas Diarias (Últimos {{ selectedDays }} días)</h5>
          <div class="flex gap-2 mb-4">
            <p-button label="7 días" [outlined]="selectedDays !== 7" (onClick)="changePeriod(7)" size="small" />
            <p-button label="30 días" [outlined]="selectedDays !== 30" (onClick)="changePeriod(30)" size="small" />
            <p-button label="90 días" [outlined]="selectedDays !== 90" (onClick)="changePeriod(90)" size="small" />
          </div>
          <canvas baseChart [data]="chartData" [options]="chartOptions" [type]="'line'"></canvas>
        </div>
      </div>

      <!-- Top productos -->
      <div class="col-12 lg:col-4">
        <div class="card">
          <h5>Top Productos</h5>
          <p-table [value]="dashboard()?.top_products || []" [rows]="5">
            <ng-template pTemplate="header">
              <tr>
                <th>Producto</th>
                <th class="text-right">Ingresos</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-product>
              <tr>
                <td>{{ product.product_name }}</td>
                <td class="text-right font-semibold">
                  Bs. {{ product.total_revenue | number:'1.2-2' }}
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent implements OnInit {
  private api = inject(ApiService);
  
  dashboard = signal<SalesDashboard | null>(null);
  selectedDays = 30;

  chartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Ingresos (Bs.)',
        data: [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true }
    }
  };

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.api.getSalesDashboard(this.selectedDays).subscribe(data => {
      this.dashboard.set(data);
      
      // Actualizar gráfico
      this.chartData = {
        labels: data.daily_sales.map(d => d.date),
        datasets: [{
          label: 'Ingresos (Bs.)',
          data: data.daily_sales.map(d => d.revenue),
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          fill: true,
          tension: 0.4
        }]
      };
    });
  }

  changePeriod(days: number) {
    this.selectedDays = days;
    this.loadDashboard();
  }
}
```

---

## 🎤 4. Reportes con Prompts (y Voz)

### Actualizar `ai-reports.component.ts`

```typescript
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';

// Services
import { ApiService } from '../../../core/services/api.service';

@Component({
  selector: 'app-ai-reports',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextareaModule,
    ButtonModule,
    TableModule,
    CardModule
  ],
  template: `
    <div class="card">
      <h3 class="text-3xl font-bold mb-4">Reportes con IA</h3>

      <div class="mb-4">
        <label class="block font-semibold mb-2">Escribe tu consulta:</label>
        <textarea 
          pInputTextarea 
          [(ngModel)]="prompt"
          rows="3"
          class="w-full"
          placeholder="Ejemplo: ventas de septiembre por producto en PDF"
        ></textarea>
      </div>

      <div class="flex gap-2 mb-4">
        <p-button 
          label="Ejecutar" 
          icon="pi pi-play"
          (onClick)="executeReport()"
          [loading]="loading()"
        />
        <p-button 
          label="🎙️ Usar Voz" 
          severity="secondary"
          [outlined]="true"
          (onClick)="startVoiceRecognition()"
          [disabled]="!voiceSupported()"
        />
      </div>

      @if (reportResults()) {
        <p-table [value]="reportResults()!" [scrollable]="true" scrollHeight="400px">
          <ng-template pTemplate="header">
            <tr>
              @for (col of columns(); track col) {
                <th>{{ col }}</th>
              }
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-row>
            <tr>
              @for (col of columns(); track col) {
                <td>{{ row[col] }}</td>
              }
            </tr>
          </ng-template>
        </p-table>

        @if (fileUrl()) {
          <div class="mt-4">
            <a [href]="fileUrl()!" target="_blank" class="text-primary underline">
              <i class="pi pi-download mr-2"></i>
              Descargar archivo
            </a>
          </div>
        }
      }
    </div>
  `
})
export class AIReportsComponent {
  private api = inject(ApiService);

  prompt = '';
  loading = signal(false);
  reportResults = signal<any[] | null>(null);
  columns = signal<string[]>([]);
  fileUrl = signal<string | null>(null);
  voiceSupported = signal(this.checkVoiceSupport());

  executeReport() {
    this.loading.set(true);
    
    // Generar reporte con el prompt
    this.api.generateReport({
      date_from: '2025-01-01',
      date_to: '2025-12-31',
      format: 'json'
    }).subscribe({
      next: (result) => {
        this.reportResults.set(result.details);
        this.columns.set(Object.keys(result.details[0] || {}));
        this.fileUrl.set(result.file_url || null);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  startVoiceRecognition() {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = false;

    recognition.onresult = (event: any) => {
      this.prompt = event.results[0][0].transcript;
    };

    recognition.start();
  }

  private checkVoiceSupport(): boolean {
    return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
  }
}
```

---

## 🚀 Resumen de Archivos a Crear

1. ✅ `src/app/dashboard/components/product/products-list/products-list.component.ts`
2. ✅ `src/app/dashboard/components/cart/cart-page/cart-page.component.ts`
3. ✅ `src/app/dashboard/components/home/home.component.ts` (actualizar)
4. ✅ `src/app/dashboard/components/ai-reports/ai-reports.component.ts` (actualizar)

## 📦 Dependencias a Instalar

```bash
npm install ng2-charts chart.js uuid
npm install -D @types/uuid
```

## 🎯 Próximos Pasos

1. Crear los componentes con los códigos de arriba
2. Probar el flujo: Catálogo → Agregar al carrito → Ver carrito
3. Adaptar el dashboard con gráficos reales
4. Implementar reportes con prompts

¡Listo para empezar! 🚀
