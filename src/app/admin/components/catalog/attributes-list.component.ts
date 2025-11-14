import { Component, OnInit, signal, inject, ViewChild, computed } from '@angular/core';
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
import { CheckboxModule } from 'primeng/checkbox';
import { AttributeService } from './services/attribute.service';
import type { Attribute } from './interfaces/attribute.interface';

@Component({
  selector: 'app-attributes-list',
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
    CheckboxModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './attributes-list.component.html'
})
export class AttributesListComponent implements OnInit {
  private service = inject(AttributeService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  // Signals
  attributes = signal<Attribute[]>([]);
  loading = signal<boolean>(false);
  attributeDialog = signal<boolean>(false);
  submitted = signal<boolean>(false);
  currentAttribute = signal<Attribute>({} as Attribute);
  selectedAttributes = signal<Attribute[]>([]);

  // ViewChild
  @ViewChild('dt') table!: Table;

  // Type options
  typeOptions = [
    { label: 'Texto', value: 'text' },
    { label: 'Número', value: 'number' },
    { label: 'Selección Simple', value: 'select' },
    { label: 'Selección Múltiple', value: 'multiselect' },
    { label: 'Booleano', value: 'boolean' }
  ];

  ngOnInit(): void {
    this.loadAttributes();
  }

  loadAttributes(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: (response) => {
        this.attributes.set(response.data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading attributes:', err);
        this.showError('No se pudieron cargar los atributos');
        this.loading.set(false);
      }
    });
  }

  openNew(): void {
    this.currentAttribute.set({
      name: '',
      code: '',
      type: 'text',
      required: false,
      active: true
    } as Attribute);
    this.submitted.set(false);
    this.attributeDialog.set(true);
  }

  edit(attribute: Attribute): void {
    this.currentAttribute.set({ ...attribute });
    this.attributeDialog.set(true);
  }

  delete(attribute: Attribute): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el atributo "${attribute.name}"?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        this.service.delete(attribute.id!).subscribe({
          next: () => {
            this.attributes.update(items => items.filter(i => i.id !== attribute.id));
            this.showSuccess('Atributo eliminado correctamente');
          },
          error: (err) => {
            console.error('Error deleting attribute:', err);
            this.showError('No se pudo eliminar el atributo');
          }
        });
      }
    });
  }

  deleteSelected(): void {
    const selected = this.selectedAttributes();
    if (selected.length === 0) return;

    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar ${selected.length} atributo(s)?`,
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      accept: () => {
        const ids = selected.map(a => a.id!);
        this.service.deleteMultiple(ids).subscribe({
          next: () => {
            this.attributes.update(items => items.filter(i => !ids.includes(i.id!)));
            this.selectedAttributes.set([]);
            this.showSuccess(`${selected.length} atributo(s) eliminado(s)`);
          },
          error: (err) => {
            console.error('Error deleting attributes:', err);
            this.showError('No se pudieron eliminar los atributos');
          }
        });
      }
    });
  }

  save(): void {
    this.submitted.set(true);
    const attr = this.currentAttribute();

    if (!attr.name?.trim() || !attr.code?.trim()) {
      return;
    }

    if (attr.id) {
      this.service.update(attr.id, attr).subscribe({
        next: (response) => {
          this.attributes.update(items =>
            items.map(i => i.id === attr.id ? response.data : i)
          );
          this.showSuccess('Atributo actualizado correctamente');
          this.hideDialog();
        },
        error: (err) => {
          console.error('Error updating attribute:', err);
          this.showError('No se pudo actualizar el atributo');
        }
      });
    } else {
      this.service.create(attr).subscribe({
        next: (response) => {
          this.attributes.update(items => [...items, response.data]);
          this.showSuccess('Atributo creado correctamente');
          this.hideDialog();
        },
        error: (err) => {
          console.error('Error creating attribute:', err);
          this.showError('No se pudo crear el atributo');
        }
      });
    }
  }

  hideDialog(): void {
    this.attributeDialog.set(false);
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
      text: 'info',
      number: 'success',
      select: 'warn',
      multiselect: 'warn',
      boolean: 'danger'
    };
    return severities[type] || 'info';
  }

  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail, life: 3000 });
  }

  private showError(detail: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail, life: 3000 });
  }
}
