# Script para configurar el bucket S3 para hosting estático
# Ejecutar SOLO UNA VEZ al crear el bucket

$BucketName = "eshop-fe"
$Region = "us-east-1"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  Configuracion Bucket S3" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Verificar si el bucket existe
Write-Host "[1/6] Verificando bucket..." -ForegroundColor Cyan
$bucketExists = aws s3 ls s3://$BucketName 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Bucket no existe. Creando..." -ForegroundColor Yellow
    aws s3 mb s3://$BucketName --region $Region
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: No se pudo crear el bucket" -ForegroundColor Red
        exit 1
    }
    Write-Host "OK: Bucket creado" -ForegroundColor Green
} else {
    Write-Host "OK: Bucket existe" -ForegroundColor Green
}

# 2. Deshabilitar Block Public Access
Write-Host "`n[2/6] Configurando acceso publico..." -ForegroundColor Cyan
aws s3api put-public-access-block `
    --bucket $BucketName `
    --public-access-block-configuration "BlockPublicAcls=false,IgnorePublicAcls=false,BlockPublicPolicy=false,RestrictPublicBuckets=false"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo configurar acceso publico" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Acceso publico configurado" -ForegroundColor Green

# 3. Aplicar Bucket Policy
Write-Host "`n[3/6] Aplicando politica del bucket..." -ForegroundColor Cyan
aws s3api put-bucket-policy `
    --bucket $BucketName `
    --policy file://s3-bucket-policy.json

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo aplicar la politica" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Politica aplicada" -ForegroundColor Green

# 4. Configurar Website Hosting
Write-Host "`n[4/6] Habilitando static website hosting..." -ForegroundColor Cyan
aws s3api put-bucket-website `
    --bucket $BucketName `
    --website-configuration '{
        "IndexDocument": {"Suffix": "index.html"},
        "ErrorDocument": {"Key": "index.html"}
    }'

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: No se pudo configurar website hosting" -ForegroundColor Red
    exit 1
}
Write-Host "OK: Website hosting habilitado" -ForegroundColor Green

# 5. Configurar CORS
Write-Host "`n[5/6] Configurando CORS..." -ForegroundColor Cyan
aws s3api put-bucket-cors `
    --bucket $BucketName `
    --cors-configuration file://s3-cors-config.json

if ($LASTEXITCODE -ne 0) {
    Write-Host "ADVERTENCIA: No se pudo configurar CORS (opcional)" -ForegroundColor Yellow
} else {
    Write-Host "OK: CORS configurado" -ForegroundColor Green
}

# 6. Verificar configuracion
Write-Host "`n[6/6] Verificando configuracion..." -ForegroundColor Cyan
$website = aws s3api get-bucket-website --bucket $BucketName 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "OK: Configuracion verificada" -ForegroundColor Green
} else {
    Write-Host "ADVERTENCIA: No se pudo verificar configuracion" -ForegroundColor Yellow
}

# Resumen
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "  ✓ CONFIGURACION COMPLETA" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

Write-Host "`nInformacion del bucket:" -ForegroundColor Cyan
Write-Host "  Nombre: $BucketName" -ForegroundColor White
Write-Host "  Region: $Region" -ForegroundColor White
Write-Host "`nURLs de acceso:" -ForegroundColor Cyan
Write-Host "  Website: http://$BucketName.s3-website-$Region.amazonaws.com" -ForegroundColor Yellow
Write-Host "  Direct:  https://$BucketName.s3.$Region.amazonaws.com/index.html" -ForegroundColor Yellow
Write-Host "`nProximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Actualizar environment.prod.ts con la URL del backend" -ForegroundColor White
Write-Host "  2. Ejecutar: npm run deploy" -ForegroundColor White
Write-Host ""
