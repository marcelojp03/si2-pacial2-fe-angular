import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AIReportRequest, AIReportResponse, AIReportData, ReportFormat } from '../../../core/models/reports.model';

@Injectable({ providedIn: 'root' })
export class AiReportsService {
  private readonly apiUrl = `${environment.api.baseUrl}/analytics/reports`;
  constructor(private http: HttpClient) {}
  
  generateReport(request: AIReportRequest): Observable<AIReportResponse> {
    return this.http.post<AIReportResponse>(`${this.apiUrl}/ai-report/`, request).pipe(
      map(response => response),
      catchError(error => throwError(() => new Error(error.error?.error || 'Error')))
    );
  }

  downloadReport(request: AIReportRequest): Observable<Blob> {
    const headers = new HttpHeaders({ Accept: this.getAcceptHeader(request.format) });
    return this.http.post(`${this.apiUrl}/ai-report/`, request, { headers, responseType: 'blob', observe: 'response' }).pipe(
      map(response => response.body!),
      catchError(() => throwError(() => new Error('Error al descargar')))
    );
  }

  convertToCSV(data: AIReportData): string {
    if (!data.columns || !data.rows || data.rows.length === 0) return '';
    const header = data.columns.join(',');
    const rows = data.rows.map(row => data.columns.map(col => row[col as keyof typeof row]).join(','));
    return [header, ...rows].join('\n');
  }

  downloadCSV(content: string, filename = 'reporte.csv'): void {
    this.downloadFile(new Blob([content], { type: 'text/csv' }), filename, 'csv');
  }

  downloadFile(blob: Blob, filename: string, format: ReportFormat): void {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${format === 'excel' ? 'xlsx' : format}`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private getAcceptHeader(format: ReportFormat): string {
    const headers = { json: 'application/json', csv: 'text/csv', excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', pdf: 'application/pdf' };
    return headers[format];
  }
}
