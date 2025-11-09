# Script para refactorizar componentes de shopping con SharedModule

$rootPath = "c:\UAGRM\Sistemas de informacion 2\semestre-2-2025\segundo-parcial\ecommerce-angular-fe\src\app\shopping"

Write-Host "=== REFACTORIZANDO SHOPPING MODULE ===" -ForegroundColor Cyan

function Refactor-ShoppingComponent {
    param([string]$filePath)
    
    if (-not (Test-Path $filePath)) {
        Write-Host "✗ No existe: $filePath" -ForegroundColor Red
        return
    }
    
    Write-Host "Procesando: $filePath" -ForegroundColor Yellow
    
    $content = Get-Content $filePath -Raw
    
    # 1. Remover CommonModule
    $content = $content -replace "import\s*\{\s*CommonModule\s*\}\s*from\s*'@angular/common';\r?\n", ""
    
    # 2. Simplificar imports de Forms
    $content = $content -replace "import\s*\{[^\}]*ReactiveFormsModule[^\}]*\}\s*from\s*'@angular/forms';\r?\n?", "import { FormBuilder, FormGroup, Validators } from '@angular/forms';`n"
    $content = $content -replace "import\s*\{\s*FormsModule\s*\}\s*from\s*'@angular/forms';\r?\n", ""
    
    # 3. Remover TODOS los imports de PrimeNG excepto primeng/api
    $content = $content -replace "import\s*\{[^\}]*\}\s*from\s*'primeng/(table|button|card|dialog|toolbar|toast|tag|input.*|icon.*|checkbox|dropdown|calendar|multiselect|password|textarea|fileupload|chips|editor|selectbutton|slider|rating|togglebutton|tristatecheckbox|colorpicker|radiobutton|listbox|orderlist|picklist|tree|treetable|organizationchart|paginator|accordion|tabview|panel|fieldset|divider|splitter|scrollpanel|confirmdialog|overlaypanel|sidebar|tooltip|messages|message|chart|progressbar|progressspinner|skeleton|badge|avatar|chip|inplace|scrolltop|terminal|blockui|megamenu|menu|menubar|panelmenu|slidemenu|tieredmenu|breadcrumb|contextmenu|dock|steps|tabmenu|speeddial|galleria|carousel|image|timeline|dataview|virtualscroller)';\r?\n", ""
    
    # 4. Agregar SharedModule si no existe
    if ($content -notmatch "import.*SharedModule") {
        # Determinar el número de ../ según la profundidad
        $relativePath = $filePath.Replace($rootPath, "").Replace("\", "/")
        $depth = ($relativePath -split "/").Count - 2
        $pathToShared = "../" * $depth + "../shared/shared.module"
        
        $content = $content -replace "(import\s*\{[^\}]*\}\s*from\s*'@angular/core';)", "`$1`nimport { SharedModule } from '$pathToShared';"
    }
    
    # 5. Limpiar imports array
    $primengModules = @('TableModule', 'ButtonModule', 'CardModule', 'DialogModule', 'ToolbarModule', 
                        'ToastModule', 'TagModule', 'InputTextModule', 'IconFieldModule', 'InputIconModule',
                        'CheckboxModule', 'DropdownModule', 'CalendarModule', 'FormsModule', 'ReactiveFormsModule',
                        'CommonModule', 'ConfirmDialogModule', 'ProgressSpinnerModule', 'ProgressBarModule',
                        'DataViewModule', 'GalleriaModule', 'ImageModule', 'CarouselModule')
    
    foreach ($module in $primengModules) {
        $content = $content -replace ",?\s*$module\s*,?", ""
    }
    
    # 6. Limpiar comas sobrantes
    $content = $content -replace "imports:\s*\[\s*,", "imports: ["
    $content = $content -replace ",\s*,", ","
    $content = $content -replace ",\s*\]", "]"
    
    # 7. Asegurar SharedModule en imports
    if ($content -match "imports:\s*\[" -and $content -notmatch "imports:\s*\[[^\]]*SharedModule") {
        $content = $content -replace "(imports:\s*\[)", "`$1`n    SharedModule,"
    }
    
    # 8. Tipado any
    $content = $content -replace '\(res\)\s*=>', '(res: any) =>'
    $content = $content -replace '\(err\)\s*=>', '(err: any) =>'
    $content = $content -replace '\(error\)\s*=>', '(error: any) =>'
    $content = $content -replace '\(response\)\s*=>', '(response: any) =>'
    
    Set-Content -Path $filePath -Value $content -NoNewline
    Write-Host "✓ Completado" -ForegroundColor Green
}

# Archivos a refactorizar
$files = @(
    "$rootPath\shopping.component.ts",
    "$rootPath\components\home\home.component.ts",
    "$rootPath\components\catalog\products-list.component.ts",
    "$rootPath\components\cart\cart-page.component.ts",
    "$rootPath\components\cart\checkout.component.ts",
    "$rootPath\components\orders\my-orders.component.ts",
    "$rootPath\components\orders\order-detail.component.ts",
    "$rootPath\components\topbar.widget.ts",
    "$rootPath\components\hero.widget.ts",
    "$rootPath\components\features.widget.ts",
    "$rootPath\components\highlights.widget.ts",
    "$rootPath\components\pricing.widget.ts",
    "$rootPath\components\footer.widget.ts"
)

foreach ($file in $files) {
    Refactor-ShoppingComponent -filePath $file
}

Write-Host "`n=== REFACTORIZACIÓN SHOPPING COMPLETADA ===" -ForegroundColor Green
Write-Host "Archivos procesados: $($files.Count)" -ForegroundColor Cyan
