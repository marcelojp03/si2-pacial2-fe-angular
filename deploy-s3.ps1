# E-Commerce Angular - Deploy to S3
# Bucket: eshop-fe
# Region: us-east-1

$BucketName = "eshop-fe"
$BuildFolder = "dist/erp-fe-sakai/browser"
$Region = "us-east-1"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  E-Commerce Angular - Deploy S3" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Verificar AWS CLI
Write-Host "[1/5] Verificando AWS CLI..." -ForegroundColor Cyan
$awsVersion = aws --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: AWS CLI no esta instalado" -ForegroundColor Red
    Write-Host "Instalar desde: https://aws.amazon.com/cli/" -ForegroundColor Yellow
    exit 1
}
Write-Host "OK: $awsVersion" -ForegroundColor Green

# 2. Build de produccion
Write-Host "`n[2/5] Build de produccion..." -ForegroundColor Cyan
npm run build:prod
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR en build" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Build completado" -ForegroundColor Green

# 3. Verificar carpeta de build
Write-Host "`n[3/5] Verificando build..." -ForegroundColor Cyan
if (!(Test-Path $BuildFolder)) {
    Write-Host "ERROR: No existe $BuildFolder" -ForegroundColor Red
    exit 1
}
$fileCount = (Get-ChildItem -Path $BuildFolder -Recurse -File).Count
Write-Host "OK: $fileCount archivos listos para deploy" -ForegroundColor Green

# 4. Subir a S3
Write-Host "`n[4/5] Subiendo a S3..." -ForegroundColor Cyan
Write-Host "Bucket: s3://$BucketName" -ForegroundColor Cyan
Write-Host "Region: $Region" -ForegroundColor Cyan

# Subir assets estaticos con cache de 1 año (CSS, JS, imagenes, fuentes)
Write-Host "`nSubiendo assets estaticos (cache: 1 año)..." -ForegroundColor Yellow
aws s3 sync $BuildFolder s3://$BucketName `
    --region $Region `
    --delete `
    --cache-control "public,max-age=31536000,immutable" `
    --exclude "*.html" `
    --exclude "*.json"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR subiendo assets" -ForegroundColor Red
    exit 1
}

# Subir HTML y JSON sin cache (para actualizaciones inmediatas)
Write-Host "Subiendo HTML y JSON (sin cache)..." -ForegroundColor Yellow
aws s3 sync $BuildFolder s3://$BucketName `
    --region $Region `
    --exclude "*" `
    --include "*.html" `
    --include "*.json" `
    --cache-control "public,max-age=0,must-revalidate" `
    --content-type "text/html"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR subiendo HTML" -ForegroundColor Red
    exit 1
}

Write-Host "OK: Archivos subidos correctamente" -ForegroundColor Green

# 5. Resumen final
Write-Host "`n[5/5] Completado!" -ForegroundColor Cyan
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ✓ DEPLOYMENT EXITOSO" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nURLs de acceso:" -ForegroundColor Cyan
Write-Host "  S3 Website: http://$BucketName.s3-website-$Region.amazonaws.com" -ForegroundColor Yellow
Write-Host "  S3 Direct:  https://$BucketName.s3.$Region.amazonaws.com/index.html" -ForegroundColor Yellow
Write-Host "`nNota: Asegurate de que el bucket tenga:" -ForegroundColor Cyan
Write-Host "  - Static website hosting habilitado" -ForegroundColor White
Write-Host "  - Politicas de acceso publico configuradas" -ForegroundColor White
Write-Host "  - CORS configurado si es necesario" -ForegroundColor White
Write-Host ""
