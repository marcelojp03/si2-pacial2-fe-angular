# Script para reemplazar environment.backend por environment.api

$files = @(
  "src/app/admin/components/ai-reports/ai-reports.service.ts",
  "src/app/admin/components/backup/backup.service.ts",
  "src/app/admin/components/csv-export/csv-export.component.ts",
  "src/app/admin/components/inventory/inventory.service.ts",
  "src/app/admin/components/movements/movements.service.ts",
  "src/app/admin/components/org-users/org-users.service.ts",
  "src/app/admin/components/product/product.service.ts",
  "src/app/admin/components/production/boms/boms.service.ts",
  "src/app/admin/components/production/work-orders/work-orders.service.ts",
  "src/app/admin/components/reorder-suggestions/reorder-suggestions.service.ts",
  "src/app/admin/components/roles/roles.service.ts",
  "src/app/admin/components/stocks-low/stocks-low.service.ts",
  "src/app/admin/components/subscription/subscription.service.ts",
  "src/app/admin/components/suppliers/supplier-item.service.ts",
  "src/app/admin/components/suppliers/supplier.service.ts",
  "src/app/admin/components/system-logs/system-logs.service.ts",
  "src/app/admin/components/warehouses/warehouse.service.ts",
  "src/app/core/http/http.interceptor.ts",
  "src/app/shared/services/payment_method.service.ts"
)

$count = 0
foreach($file in $files) { 
  if(Test-Path $file) { 
    $content = Get-Content $file -Raw
    $content = $content -replace 'environment\.backend\.host', 'environment.api.baseUrl'
    $content = $content -replace 'environment\.backend\.reportes', 'environment.api.baseUrl'
    $content = $content -replace 'environment\.backend', 'environment.api'
    Set-Content $file $content -NoNewline
    Write-Host "✓ $file" -ForegroundColor Green
    $count++
  } else {
    Write-Host "✗ No existe: $file" -ForegroundColor Red
  }
}

Write-Host "`n$count archivos corregidos" -ForegroundColor Cyan
