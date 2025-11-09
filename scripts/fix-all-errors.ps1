#!/usr/bin/env pwsh
# Script para corregir todos los errores restantes del proyecto

Write-Host "=== CORRIGIENDO ERRORES DEL PROYECTO ===" -ForegroundColor Cyan
Write-Host ""

$erroresCorregidos = 0

# ============================================
# 1. FIX: environment.backend -> environment.api.baseUrl
# ============================================
Write-Host "1. Corrigiendo referencias a environment.backend..." -ForegroundColor Yellow

$archivosEnvironment = @(
    "src/app/core/services/auth.service.ts",
    "src/app/core/services/dashboard.service.ts",
    "src/app/shared/services/data.service.ts",
    "src/app/shopping/services/plan.service.ts"
)

foreach ($archivo in $archivosEnvironment) {
    if (Test-Path $archivo) {
        $contenido = Get-Content $archivo -Raw
        $contenidoOriginal = $contenido
        
        # Reemplazar environment.backend.host por environment.api.baseUrl
        $contenido = $contenido -replace 'environment\.backend\.host', 'environment.api.baseUrl'
        
        if ($contenido -ne $contenidoOriginal) {
            Set-Content -Path $archivo -Value $contenido -NoNewline
            Write-Host "  ✓ $archivo" -ForegroundColor Green
            $erroresCorregidos++
        }
    }
}

# ============================================
# 2. FIX: HttpApi.oauthLogin -> HttpApi.authLogin
# ============================================
Write-Host ""
Write-Host "2. Corrigiendo HttpApi.oauthLogin..." -ForegroundColor Yellow

$archivoAuth = "src/app/core/services/auth.service.ts"
if (Test-Path $archivoAuth) {
    $contenido = Get-Content $archivoAuth -Raw
    $contenidoOriginal = $contenido
    
    # Reemplazar HttpApi.oauthLogin por HttpApi.authLogin
    $contenido = $contenido -replace 'HttpApi\.oauthLogin', 'HttpApi.authLogin'
    
    if ($contenido -ne $contenidoOriginal) {
        Set-Content -Path $archivoAuth -Value $contenido -NoNewline
        Write-Host "  ✓ $archivoAuth" -ForegroundColor Green
        $erroresCorregidos++
    }
}

# ============================================
# 3. FIX: Eliminar imports de dashboard obsoleto
# ============================================
Write-Host ""
Write-Host "3. Eliminando imports obsoletos de dashboard..." -ForegroundColor Yellow

$archivoDashboard = "src/app/core/services/dashboard.service.ts"
if (Test-Path $archivoDashboard) {
    # Este servicio debe ser eliminado o refactorizado completamente
    # Por ahora, eliminamos el import problemático
    $contenido = Get-Content $archivoDashboard -Raw
    $contenidoOriginal = $contenido
    
    # Eliminar imports de dashboard/components/home/home.interface
    $contenido = $contenido -replace "(?m)^.*from\s+['\`"]\.\.\/\.\.\/dashboard\/components\/home\/home\.interface['\`"];?\r?\n", ""
    
    if ($contenido -ne $contenidoOriginal) {
        Set-Content -Path $archivoDashboard -Value $contenido -NoNewline
        Write-Host "  ✓ $archivoDashboard - imports eliminados" -ForegroundColor Green
        $erroresCorregidos++
    }
}

# ============================================
# 4. FIX: checkout.component.ts - ReactiveStepsModule
# ============================================
Write-Host ""
Write-Host "4. Corrigiendo checkout.component.ts..." -ForegroundColor Yellow

$archivoCheckout = "src/app/shopping/components/cart/checkout.component.ts"
if (Test-Path $archivoCheckout) {
    $contenido = Get-Content $archivoCheckout -Raw
    $contenidoOriginal = $contenido
    
    # Eliminar ReactiveStepsModule de imports
    $contenido = $contenido -replace ',\s*ReactiveStepsModule', ''
    $contenido = $contenido -replace 'ReactiveStepsModule\s*,\s*', ''
    $contenido = $contenido -replace 'ReactiveStepsModule', ''
    
    if ($contenido -ne $contenidoOriginal) {
        Set-Content -Path $archivoCheckout -Value $contenido -NoNewline
        Write-Host "  ✓ $archivoCheckout" -ForegroundColor Green
        $erroresCorregidos++
    }
}

# ============================================
# 5. FIX: order-detail.component.ts - DividerModule
# ============================================
Write-Host ""
Write-Host "5. Corrigiendo order-detail.component.ts..." -ForegroundColor Yellow

$archivoOrderDetail = "src/app/shopping/components/orders/order-detail.component.ts"
if (Test-Path $archivoOrderDetail) {
    $contenido = Get-Content $archivoOrderDetail -Raw
    $contenidoOriginal = $contenido
    
    # Eliminar DividerModule de imports array
    $contenido = $contenido -replace ',\s*DividerModule', ''
    $contenido = $contenido -replace 'DividerModule\s*,\s*', ''
    $contenido = $contenido -replace 'SharedModule,DividerModule', 'SharedModule'
    
    if ($contenido -ne $contenidoOriginal) {
        Set-Content -Path $archivoOrderDetail -Value $contenido -NoNewline
        Write-Host "  ✓ $archivoOrderDetail" -ForegroundColor Green
        $erroresCorregidos++
    }
}

# ============================================
# 6. FIX: pricing.widget.ts - Syntax errors
# ============================================
Write-Host ""
Write-Host "6. Corrigiendo pricing.widget.ts..." -ForegroundColor Yellow

$archivoPricing = "src/app/shopping/components/pricing.widget.ts"
if (Test-Path $archivoPricing) {
    $contenido = Get-Content $archivoPricing -Raw
    $contenidoOriginal = $contenido
    
    # Fix: Agregar comas faltantes y eliminar módulos duplicados
    $contenido = $contenido -replace 'SharedModule,\s*DividerModule\s+RippleModule,\s*SkeletonModule', 'SharedModule'
    $contenido = $contenido -replace 'SharedModule,\s*DividerModule', 'SharedModule'
    $contenido = $contenido -replace 'DividerModule\s+RippleModule', 'SharedModule'
    
    if ($contenido -ne $contenidoOriginal) {
        Set-Content -Path $archivoPricing -Value $contenido -NoNewline
        Write-Host "  ✓ $archivoPricing" -ForegroundColor Green
        $erroresCorregidos++
    }
}

# ============================================
# 7. FIX: topbar.widget.ts - Missing comma
# ============================================
Write-Host ""
Write-Host "7. Corrigiendo topbar.widget.ts..." -ForegroundColor Yellow

$archivoTopbar = "src/app/shopping/components/topbar.widget.ts"
if (Test-Path $archivoTopbar) {
    $contenido = Get-Content $archivoTopbar -Raw
    $contenidoOriginal = $contenido
    
    # Fix: Agregar comas faltantes
    $contenido = $contenido -replace 'StyleClassModule\s+RippleModule', 'StyleClassModule, RippleModule'
    $contenido = $contenido -replace 'SharedModule,RouterModule,\s*StyleClassModule\s+RippleModule', 'SharedModule'
    
    if ($contenido -ne $contenidoOriginal) {
        Set-Content -Path $archivoTopbar -Value $contenido -NoNewline
        Write-Host "  ✓ $archivoTopbar" -ForegroundColor Green
        $erroresCorregidos++
    }
}

# ============================================
# RESUMEN
# ============================================
Write-Host ""
Write-Host "=== RESUMEN ===" -ForegroundColor Cyan
Write-Host "Errores corregidos: $erroresCorregidos" -ForegroundColor Green
Write-Host ""
Write-Host "Nota: Algunos errores requieren creación de interfaces/tipos:" -ForegroundColor Yellow
Write-Host "  - dashboard.service.ts necesita interfaces locales (DashboardStatsResponse, etc.)" -ForegroundColor Yellow
Write-Host "  - orders.service.ts tiene conflicto de tipos Order (shopping vs core)" -ForegroundColor Yellow
Write-Host ""
Write-Host "=== SCRIPT COMPLETADO ===" -ForegroundColor Green
