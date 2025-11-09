# Script masivo para refactorizar todos los componentes admin
# Reemplaza imports individuales de PrimeNG con SharedModule

$rootPath = "c:\UAGRM\Sistemas de informacion 2\semestre-2-2025\segundo-parcial\ecommerce-angular-fe\src\app\admin\components"

Write-Host "=== INICIANDO REFACTORIZACIÓN MASIVA ===" -ForegroundColor Cyan

# Función para refactorizar un archivo
function Refactor-Component {
    param([string]$filePath)
    
    if (-not (Test-Path $filePath)) {
        Write-Host "✗ No existe: $filePath" -ForegroundColor Red
        return
    }
    
    Write-Host "Procesando: $filePath" -ForegroundColor Yellow
    
    $content = Get-Content $filePath -Raw
    
    # 1. Remover CommonModule
    $content = $content -replace "import\s*\{\s*CommonModule\s*\}\s*from\s*'@angular/common';\r?\n", ""
    
    # 2. Simplificar imports de Forms (ya están en SharedModule)  
    $content = $content -replace "import\s*\{[^\}]*ReactiveFormsModule[^\}]*\}\s*from\s*'@angular/forms';\r?\n?", "import { FormBuilder, FormGroup, Validators } from '@angular/forms';`n"
    $content = $content -replace "import\s*\{\s*FormsModule\s*\}\s*from\s*'@angular/forms';\r?\n", ""
    
    # 3. Remover TODOS los imports individuales de PrimeNG (excepto primeng/api)
    $content = $content -replace "import\s*\{[^\}]*\}\s*from\s*'primeng/(table|button|card|dialog|toolbar|toast|tag|input.*|icon.*|checkbox|dropdown|calendar|multiselect|password|textarea|fileupload|chips|editor|selectbutton|slider|rating|togglebutton|tristatecheckbox|colorpicker|radiobutton|listbox|orderlist|picklist|tree|treetable|organizationchart|paginator|accordion|tabview|panel|fieldset|divider|splitter|scrollpanel|card|toolbar|confirmdialog|overlaypanel|sidebar|tooltip|messages|message|chart|progressbar|progressspinner|skeleton|badge|avatar|chip|inplace|scrolltop|tag|terminal|blockui|megamenu|menu|menubar|panelmenu|slidemenu|tieredmenu|breadcrumb|contextmenu|dock|steps|tabmenu|speeddial|galleria|carousel|image|timeline)';\r?\n", ""
    
    # 4. Agregar SharedModule al inicio si no existe
    if ($content -notmatch "import.*SharedModule") {
        $content = $content -replace "(import\s*\{[^\}]*\}\s*from\s*'@angular/core';)", "`$1`nimport { SharedModule } from '../../../shared/shared.module';"
    }
    
    # 5. Limpiar imports array en @Component
    # Esto es más complicado, así que solo eliminamos los módulos PrimeNG conocidos
    $primengModules = @('TableModule', 'ButtonModule', 'CardModule', 'DialogModule', 'ToolbarModule', 
                        'ToastModule', 'TagModule', 'InputTextModule', 'IconFieldModule', 'InputIconModule',
                        'CheckboxModule', 'DropdownModule', 'CalendarModule', 'FormsModule', 'ReactiveFormsModule',
                        'CommonModule', 'ConfirmDialogModule', 'ProgressSpinnerModule', 'ProgressBarModule',
                        'ChartModule', 'AvatarModule', 'BadgeModule', 'MessagesModule', 'MessageModule',
                        'PanelModule', 'TabViewModule', 'AccordionModule', 'ChipsModule', 'FileUploadModule',
                        'DividerModule', 'ScrollPanelModule', 'OverlayPanelModule', 'TooltipModule')
    
    foreach ($module in $primengModules) {
        # Remover del array imports, manejando comas correctamente
        $content = $content -replace ",?\s*$module\s*,?", ""
    }
    
    # 6. Limpiar comas sobrantes en imports array
    $content = $content -replace "imports:\s*\[\s*,", "imports: ["
    $content = $content -replace ",\s*,", ","
    $content = $content -replace ",\s*\]", "]"
    
    # 7. Asegurar que SharedModule esté en imports si existe el decorator
    if ($content -match "imports:\s*\[" -and $content -notmatch "imports:\s*\[[^\]]*SharedModule") {
        $content = $content -replace "(imports:\s*\[)", "`$1`n    SharedModule,"
    }
    
    # 8. Tipado de parámetros any
    $content = $content -replace '\(res\)\s*=>', '(res: any) =>'
    $content = $content -replace '\(err\)\s*=>', '(err: any) =>'
    $content = $content -replace '\(error\)\s*=>', '(error: any) =>'
    $content = $content -replace '\(response\)\s*=>', '(response: any) =>'
    
    Set-Content -Path $filePath -Value $content -NoNewline
    Write-Host "✓ Completado" -ForegroundColor Green
}

# Lista de archivos a refactorizar
$componentsToRefactor = @(
    "$rootPath\product\product-list\product-list.component.ts",
    "$rootPath\inventory\inventory-list\inventory-list.component.ts",
    "$rootPath\warehouses\warehouse-list\warehouse-list.component.ts",
    "$rootPath\suppliers\supplier-list\supplier-list.component.ts",
    "$rootPath\movements\movements-list.component.ts",
    "$rootPath\production\boms\boms.component.ts",
    "$rootPath\production\work-orders\work-orders.component.ts",
    "$rootPath\production\execution\execution.component.ts",
    "$rootPath\roles\roles.component.ts",
    "$rootPath\org-users\org-users.component.ts",
    "$rootPath\stocks-low\stocks-low.component.ts",
    "$rootPath\reorder-suggestions\reorder-suggestions.component.ts",
    "$rootPath\ai-reports\ai-reports.component.ts",
    "$rootPath\backup\backup.component.ts",
    "$rootPath\csv-export\csv-export.component.ts",
    "$rootPath\system-logs\system-logs.component.ts",
    "$rootPath\subscription\subscription.component.ts"
)

foreach ($file in $componentsToRefactor) {
    Refactor-Component -filePath $file
}

Write-Host "`n=== REFACTORIZACIÓN COMPLETADA ===" -ForegroundColor Green
Write-Host "Archivos procesados: $($componentsToRefactor.Count)" -ForegroundColor Cyan
Write-Host "`nREVISAR MANUALMENTE:" -ForegroundColor Yellow
Write-Host "1. Verificar que SharedModule esté en imports[]" -ForegroundColor Yellow
Write-Host "2. Remover referencias a ApiService (usar servicios específicos)" -ForegroundColor Yellow
Write-Host "3. Actualizar paths de interfaces/services" -ForegroundColor Yellow
