import { Component, OnInit, signal, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { AdjustmentService } from './services/adjustment.service';
import type { InventoryAdjustment, AdjustmentResponse } from './interfaces/adjustment.interface';

@Component({
  selector: 'app-adjustments-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    DialogModule,
    ToolbarModule,
    ToastModule,
    TagModule,
    InputTextModule,
    ConfirmDialogModule,
    IconFieldModule,
    InputIconModule,
    SelectModule,
    InputNumberModule,
    TextareaModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './adjustments-list.component.html'
})
export class AdjustmentsListComponent implements OnInit {
  private service = inject(AdjustmentService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  adjustments = signal<InventoryAdjustment[]>([]);
  loading = signal<boolean>(false);
  adjustmentDialog = signal<boolean>(false);
  submitted = signal<boolean>(false);
  currentAdjustment = signal<InventoryAdjustment>({} as InventoryAdjustment);

  @ViewChild('dt') table!: Table;

  typeOptions = [
    { label: 'Incremento', value: 'increase' },
    { label: 'Decremento', value: 'decrease' },
    { label: 'Corrección', value: 'correction' }
  ];

  ngOnInit(): void {
    this.loadAdjustments();
  }

  loadAdjustments(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (response: AdjustmentResponse) => {
        this.adjustments.set(response.data);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading adjustments:', err);
        this.showError('No se pudieron cargar los ajustes');
        this.loading.set(false);
      }
    });
  }

  openNew(): void {
    this.currentAdjustment.set({
      productId: 0,
      warehouseId: 0,
      type: 'correction',
      quantity: 0,
      reason: ''
    } as InventoryAdjustment);
    this.submitted.set(false);
    this.adjustmentDialog.set(true);
  }

  delete(adjustment: InventoryAdjustment): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar este ajuste?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.service.delete(adjustment.id!).subscribe({
          next: () => {
            this.adjustments.update(items => items.filter(i => i.id !== adjustment.id));
            this.showSuccess('Ajuste eliminado correctamente');
          },
          error: (err: any) => {
            console.error('Error deleting adjustment:', err);
            this.showError('No se pudo eliminar el ajuste');
          }
        });
      }
    });
  }

  save(): void {
    this.submitted.set(true);
    const adj = this.currentAdjustment();

    if (!adj.productId || !adj.warehouseId || !adj.quantity || !adj.reason?.trim()) {
      return;
    }

    this.service.create(adj).subscribe({
      next: (response: { data: InventoryAdjustment }) => {
        this.adjustments.update(items => [response.data, ...items]);
        this.showSuccess('Ajuste creado correctamente');
        this.hideDialog();
      },
      error: (err: any) => {
        console.error('Error creating adjustment:', err);
        this.showError('No se pudo crear el ajuste');
      }
    });
  }

  hideDialog(): void {
    this.adjustmentDialog.set(false);
    this.submitted.set(false);
  }

  onGlobalFilter(table: Table, event: Event): void {
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  exportCSV(): void {
    this.table.exportCSV();
  }

  getTypeSeverity(type: string): 'success' | 'info' | 'warn' | 'danger' {
    const severities: Record<string, any> = {
      increase: 'success',
      decrease: 'danger',
      correction: 'info'
    };
    return severities[type] || 'info';
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      increase: 'Incremento',
      decrease: 'Decremento',
      correction: 'Corrección'
    };
    return labels[type] || type;
  }

  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail, life: 3000 });
  }

  private showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail, life: 3000 });
  }
}
