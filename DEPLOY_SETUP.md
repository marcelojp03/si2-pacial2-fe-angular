# ✅ Configuración de Deploy Completada

## 📦 Archivos Creados

- ✅ `deploy-s3.ps1` - Script de deploy automático a S3
- ✅ `setup-s3-bucket.ps1` - Script de configuración inicial del bucket
- ✅ `s3-bucket-policy.json` - Política de acceso público para el bucket
- ✅ `s3-cors-config.json` - Configuración CORS del bucket
- ✅ `DEPLOY.md` - Documentación completa de deploy

## 🔧 Archivos Actualizados

- ✅ `package.json`
  - Agregado script: `build:prod`
  - Agregado script: `deploy`
  
- ✅ `angular.json`
  - Budgets aumentados: 2MB inicial, 5MB máximo
  - File replacements configurado (environment.ts → environment.prod.ts)
  
- ✅ `src/environments/environment.prod.ts`
  - ⚠️ **PENDIENTE**: Actualizar `baseUrl` con URL real del backend

## ⚙️ Configuración

**Bucket S3:**
- Nombre: `eshop-fe`
- Región: `us-east-1`
- Website URL: `http://eshop-fe.s3-website-us-east-1.amazonaws.com`

**Build:**
- Output: `dist/erp-fe-sakai/browser`
- Budgets: 2MB warning, 5MB error
- Environments: Automatic replacement en producción

## 🚀 Cómo usar

### 1️⃣ Configurar Backend URL (⚠️ IMPORTANTE)

Editar `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  api: {
    baseUrl: 'https://tu-backend-url.com/api', // ⚠️ CAMBIAR AQUÍ
    timeout: 30000,
  },
  // ...
};
```

### 2️⃣ Configurar Bucket S3 (Solo Primera Vez)

```powershell
# Ejecutar script de setup
.\setup-s3-bucket.ps1
```

Este script automáticamente:
- Crea el bucket si no existe
- Configura acceso público
- Aplica bucket policy
- Habilita static website hosting
- Configura CORS

### 3️⃣ Deploy

```powershell
# Deploy completo (build + upload)
npm run deploy
```

O manualmente:

```powershell
# 1. Build de producción
npm run build:prod

# 2. Subir a S3
.\deploy-s3.ps1
```

## 📋 Comandos Disponibles

```powershell
npm run build:prod    # Build optimizado para producción
npm run deploy        # Build + deploy a S3
.\setup-s3-bucket.ps1 # Configurar bucket (solo 1 vez)
.\deploy-s3.ps1       # Solo deploy (sin build)
```

## ✅ Checklist Pre-Deploy

- [ ] AWS CLI instalado y configurado (`aws configure`)
- [ ] Credenciales AWS válidas
- [ ] Backend URL actualizada en `environment.prod.ts`
- [ ] Bucket configurado (`.\setup-s3-bucket.ps1`)
- [ ] Build de producción exitoso (`npm run build:prod`)

## 📚 Documentación

Ver **DEPLOY.md** para documentación completa:
- Prerrequisitos
- Configuración del bucket
- Troubleshooting
- Integración con CloudFront
- Monitoreo

## 🔒 Seguridad

- ✅ No commitear credenciales AWS
- ✅ Usar IAM roles con permisos mínimos
- ✅ Rotar Access Keys periódicamente
- ✅ Habilitar MFA en cuenta AWS

---

**Fecha:** Noviembre 2025  
**Bucket:** eshop-fe  
**Región:** us-east-1
