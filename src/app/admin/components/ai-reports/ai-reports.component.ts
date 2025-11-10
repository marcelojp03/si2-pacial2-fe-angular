import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { Textarea } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { ChipModule } from 'primeng/chip';
import { AiReportsService } from './ai-reports.service';
import { AIReportRequest, AIReportResponse, ReportFormat, AI_REPORT_EXAMPLES, REPORT_TEMPLATES } from '../../../core/models/reports.model';

@Component({
  selector: 'app-ai-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, Textarea, ButtonModule, Select, TableModule, ProgressSpinnerModule, ToastModule, DividerModule, ChipModule],
  providers: [MessageService],
  templateUrl: './ai-reports.component.html',
  styleUrls: ['./ai-reports.component.scss']
})
export class AIReportsComponent implements OnInit {
  query = '';
  selectedFormat: ReportFormat = 'json';
  selectedTemplate = '';
  reportData: AIReportResponse | null = null;
  isLoading = false;
  
  formatOptions = [
    { label: 'JSON', value: 'json', icon: 'pi pi-file' },
    { label: 'CSV', value: 'csv', icon: 'pi pi-file-excel' },
    { label: 'Excel', value: 'excel', icon: 'pi pi-file-excel' },
    { label: 'PDF', value: 'pdf', icon: 'pi pi-file-pdf' }
  ];
  
  templateCategories: any[] = [];
  quickExamples = AI_REPORT_EXAMPLES;

  constructor(private aiReportsService: AiReportsService, private messageService: MessageService) {}

  ngOnInit(): void {
    this.templateCategories = REPORT_TEMPLATES.map(c => ({
      label: c.category,
      items: c.queries.map(q => ({ label: q, value: q }))
    }));
  }

  onTemplateSelect(): void {
    if (this.selectedTemplate) this.query = this.selectedTemplate;
  }

  applyExample(example: string): void {
    this.query = example;
  }

  generateReport(): void {
    if (!this.query.trim()) {
      this.messageService.add({ severity: 'warn', summary: 'Query requerida', detail: 'Por favor ingresa una consulta' });
      return;
    }
    this.isLoading = true;
    this.reportData = null;
    this.aiReportsService.generateReport({ query: this.query.trim(), format: this.selectedFormat }).subscribe({
      next: (r) => {
        this.reportData = r;
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Reporte generado', detail: `${r.data.row_count} filas` });
      },
      error: (e) => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: e.message });
      }
    });
  }

  downloadReport(): void {
    if (!this.reportData) return;
    if (this.selectedFormat === 'json') {
      this.aiReportsService.downloadFile(new Blob([JSON.stringify(this.reportData.data, null, 2)]), 'reporte', 'json');
      return;
    }
    if (this.selectedFormat === 'csv') {
      this.aiReportsService.downloadCSV(this.aiReportsService.convertToCSV(this.reportData.data), 'reporte.csv');
      return;
    }
    this.isLoading = true;
    this.aiReportsService.downloadReport({ query: this.query.trim(), format: this.selectedFormat }).subscribe({
      next: (blob) => {
        this.aiReportsService.downloadFile(blob, 'reporte', this.selectedFormat);
        this.isLoading = false;
        this.messageService.add({ severity: 'success', summary: 'Descargado' });
      },
      error: () => {
        this.isLoading = false;
        this.messageService.add({ severity: 'error', summary: 'Error' });
      }
    });
  }

  clearForm(): void {
    this.query = '';
    this.selectedFormat = 'json';
    this.selectedTemplate = '';
    this.reportData = null;
  }

  get hasResults(): boolean {
    return this.reportData !== null && this.reportData.data.rows.length > 0;
  }

  get columns(): string[] {
    return this.reportData?.data.columns || [];
  }

  get rows(): any[] {
    return this.reportData?.data.rows || [];
  }
}
