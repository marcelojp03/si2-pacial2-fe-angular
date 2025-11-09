# Script para refactorizar imports de componentes admin

$adminPath = "src\app\admin\components"

# Componentes a refactorizar
$components = @(
    "customers\customers-list.component.ts",
    "orders\orders-list.component.ts",
    "orders\order-detail.component.ts",
    "product\product-list\product-list.component.ts",
    "inventory\inventory-list\inventory-list.component.ts",
    "warehouses\warehouse-list\warehouse-list.component.ts",
    "suppliers\supplier-list\supplier-list.component.ts",
    "movements\movements-list.component.ts",
    "production\boms\boms.component.ts",
    "production\work-orders\work-orders.component.ts",
    "production\execution\execution.component.ts",
    "roles\roles.component.ts",
    "org-users\org-users.component.ts",
    "stocks-low\stocks-low.component.ts",
    "reorder-suggestions\reorder-suggestions.component.ts",
    "ai-reports\ai-reports.component.ts",
    "backup\backup.component.ts",
    "csv-export\csv-export.component.ts",
    "system-logs\system-logs.component.ts",
    "subscription\subscription.component.ts"
)

foreach ($comp in $components) {
    $file = Join-Path $adminPath $comp
    if (Test-Path $file) {
        Write-Host "Procesando: $file" -ForegroundColor Cyan
        
        # Leer contenido
        $content = Get-Content $file -Raw
        
        # Reemplazar imports de CommonModule
        $content = $content -replace "import\s*\{\s*CommonModule\s*\}\s*from\s*'@angular/common';\s*\r?\n", ""
        
        # Reemplazar imports de FormsModule/ReactiveFormsModule (ya están en SharedModule)
        $content = $content -replace "import\s*\{[^\}]*FormsModule[^\}]*\}\s*from\s*'@angular/forms';\s*\r?\n", ""
        
        # Comentar imports individuales de PrimeNG (para revisión manual)
        $content = $content -replace "import\s*\{[^\}]*\}\s*from\s*'primeng/(?!api)", "// TODO: Migrar a SharedModule - import { ... } from 'primeng/"
        
        # Agregar SharedModule si no existe
        if ($content -notmatch "SharedModule") {
            $content = $content -replace "(import\s*\{[^\}]*\}\s*from\s*'@angular/core';)", "`$1`nimport { SharedModule } from '../../../shared/shared.module';"
        }
        
        # Guardar
        Set-Content -Path $file -Value $content -NoNewline
        Write-Host "✓ Completado: $comp" -ForegroundColor Green
    } else {
        Write-Host "✗ No encontrado: $file" -ForegroundColor Red
    }
}

Write-Host "`n=== Refactorización completada ===" -ForegroundColor Yellow
Write-Host "Revisar archivos manualmente para:" -ForegroundColor Yellow
Write-Host "1. Remover imports comentados de PrimeNG" -ForegroundColor Yellow
Write-Host "2. Actualizar array 'imports' en @Component" -ForegroundColor Yellow
Write-Host "3. Verificar que SharedModule esté en imports[]" -ForegroundColor Yellow
