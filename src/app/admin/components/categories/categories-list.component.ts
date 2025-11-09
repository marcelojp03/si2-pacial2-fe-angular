import { Component, inject, OnInit, signal, computed, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Table } from 'primeng/table';
import { StatsCardComponent, type StatCardConfig } from '../../../shared/components/stats-card.component';
import type { Category } from './interfaces/category.interface';
import { CategoriesService } from './services/categories.service';

@Component({
  selector: 'app-categories-list',
  standalone: true,
  imports: [
    SharedModule,
    StatsCardComponent
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './categories-list.component.html'
})
export class CategoriesListComponent implements OnInit {
  @ViewChild('dt') table!: Table;

  private categoriesService = inject(CategoriesService);
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  categories = signal<Category[]>([]);
  loading = signal(false);
  saving = signal(false);
  selectedCategories = signal<Category[]>([]);
  
  categoryDialog = false;
  submitted = signal(false);
  currentCategory = signal<Category | null>(null);

  categoryForm: FormGroup;

  // Stats cards
  statsCards = computed<StatCardConfig[]>(() => {
    const all = this.categories();
    const active = all.filter(c => c.is_active).length;
    const inactive = all.filter(c => !c.is_active).length;
    const withParent = all.filter(c => c.parent).length;

    return [
      {
        label: 'Total Categorías',
        value: all.length.toString(),
        icon: 'pi pi-folder',
        color: 'blue'
      },
      {
        label: 'Activas',
        value: active.toString(),
        icon: 'pi pi-check-circle',
        color: 'green'
      },
      {
        label: 'Inactivas',
        value: inactive.toString(),
        icon: 'pi pi-times-circle',
        color: 'red'
      },
      {
        label: 'Subcategorías',
        value: withParent.toString(),
        icon: 'pi pi-sitemap',
        color: 'purple'
      }
    ];
  });

  constructor() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
      slug: [''],
      description: [''],
      is_active: [true]
    });
  }

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.loading.set(true);
    this.categoriesService.listCategories({ page_size: 100 }).subscribe({
      next: (res: any) => {
        this.categories.set(res.results);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Error loading categories:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar las categorías'
        });
        this.loading.set(false);
      }
    });
  }

  openNew() {
    this.currentCategory.set(null);
    this.submitted.set(false);
    this.categoryForm.reset({ is_active: true });
    this.categoryDialog = true;
  }

  editCategory(category: Category) {
    this.currentCategory.set(category);
    this.submitted.set(false);
    this.categoryForm.patchValue({
      name: category.name,
      slug: category.slug,
      description: category.description,
      is_active: category.is_active
    });
    this.categoryDialog = true;
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted.set(false);
    this.categoryForm.reset({ is_active: true });
    this.currentCategory.set(null);
  }

  saveCategory() {
    this.submitted.set(true);

    if (this.categoryForm.invalid) {
      return;
    }

    this.saving.set(true);
    const formValue = this.categoryForm.value;

    const categoryData: any = {
      name: formValue.name,
      description: formValue.description || '',
      is_active: formValue.is_active
    };

    // Si el slug está vacío, no lo enviamos (el backend lo generará)
    if (formValue.slug) {
      categoryData.slug = formValue.slug;
    }

    const request$ = this.currentCategory()
      ? this.categoriesService.updateCategory(this.currentCategory()!.id, categoryData)
      : this.categoriesService.createCategory(categoryData);

    request$.subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: this.currentCategory() 
            ? 'Categoría actualizada correctamente' 
            : 'Categoría creada correctamente'
        });
        this.hideDialog();
        this.loadCategories();
        this.saving.set(false);
      },
      error: (err: any) => {
        console.error('Error saving category:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo guardar la categoría'
        });
        this.saving.set(false);
      }
    });
  }

  deleteCategory(category: Category) {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar la categoría "${category.name}"?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.categoriesService.deleteCategory(category.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Categoría eliminada correctamente'
            });
            this.loadCategories();
          },
          error: (err: any) => {
            console.error('Error deleting category:', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No se pudo eliminar la categoría'
            });
          }
        });
      }
    });
  }

  deleteSelectedCategories() {
    this.confirmationService.confirm({
      message: `¿Estás seguro de eliminar ${this.selectedCategories().length} categorías?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
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
}
