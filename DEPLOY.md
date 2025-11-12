# 🚀 Deploy a AWS S3

## Prerrequisitos

### 1. AWS CLI Instalado
```powershell
# Verificar instalación
aws --version

# Si no está instalado, descargar desde:
# https://aws.amazon.com/cli/
```

### 2. Credenciales AWS Configuradas
```powershell
# Configurar credenciales
aws configure

# Ingresar:
# - AWS Access Key ID
# - AWS Secret Access Key
# - Default region name: us-east-1
# - Default output format: json
```

### 3. Bucket S3 Configurado

El bucket `eshop-fe` debe tener:

#### a) Static Website Hosting Habilitado
```
1. AWS Console → S3 → eshop-fe
2. Properties → Static website hosting → Edit
3. Enable
4. Index document: index.html
5. Error document: index.html (para Angular routing)
```

#### b) Bucket Policy (Acceso Público)
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::eshop-fe/*"
    }
  ]
}
```

#### c) CORS Configuration (si es necesario)
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

## 📝 Configuración Previa al Deploy

### 1. Actualizar URL del Backend
Editar `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  api: {
    baseUrl: 'https://tu-backend-url.com/api', // ⚠️ Cambiar aquí
    timeout: 30000,
  },
  // ...
};
```

### 2. Verificar Configuración de Build
- ✅ `angular.json` → budgets aumentados (2MB inicial, 5MB error)
- ✅ `angular.json` → fileReplacements configurado para producción
- ✅ `package.json` → scripts de build:prod y deploy

## 🚀 Deploy

### Opción 1: Script Automático (Recomendado)
```powershell
npm run deploy
```

Este comando ejecuta:
1. Build de producción (`ng build --configuration production`)
2. Sube archivos a S3 con cache optimizado
3. Muestra URLs de acceso

### Opción 2: Manual
```powershell
# 1. Build
npm run build:prod

# 2. Deploy
.\deploy-s3.ps1
```

### Opción 3: Solo Build (sin deploy)
```powershell
npm run build:prod
```

## 🔍 Verificación del Deploy

### 1. Verificar Build Local
```powershell
# Debe existir la carpeta dist/erp-fe-sakai/browser
ls dist/erp-fe-sakai/browser

# Verificar que index.html existe
cat dist/erp-fe-sakai/browser/index.html
```

### 2. URLs de Acceso Post-Deploy
```
S3 Website: http://eshop-fe.s3-website-us-east-1.amazonaws.com
S3 Direct:  https://eshop-fe.s3.us-east-1.amazonaws.com/index.html
```

### 3. Verificar en Browser
```powershell
# Abrir en navegador (PowerShell)
Start-Process "http://eshop-fe.s3-website-us-east-1.amazonaws.com"
```

## 📦 Archivos del Deploy

```
deploy-s3.ps1          # Script de deploy
dist/                  # Carpeta generada por build
  erp-fe-sakai/
    browser/           # Archivos a subir a S3
      index.html
      main-*.js
      polyfills-*.js
      styles-*.css
      assets/
```

## ⚙️ Configuración de Cache

El script aplica dos políticas de cache:

### Assets Estáticos (JS, CSS, imágenes)
```
Cache-Control: public,max-age=31536000,immutable
```
- Cache de 1 año
- Optimiza carga para usuarios recurrentes

### HTML y JSON
```
Cache-Control: public,max-age=0,must-revalidate
```
- Sin cache
- Actualizaciones inmediatas

## 🔧 Troubleshooting

### Error: AWS CLI no encontrado
```powershell
# Instalar AWS CLI v2
# https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-windows.html
```

### Error: Access Denied
```powershell
# Verificar credenciales
aws sts get-caller-identity

# Reconfigurar si es necesario
aws configure
```

### Error: Bucket no existe
```powershell
# Crear bucket
aws s3 mb s3://eshop-fe --region us-east-1

# O verificar nombre correcto
aws s3 ls
```

### Error: Build falla
```powershell
# Limpiar node_modules y reinstalar
rm -r node_modules
rm package-lock.json
npm install

# Intentar build nuevamente
npm run build:prod
```

### Error: 404 en rutas de Angular
- Verificar que Error document en S3 = `index.html`
- Esto permite que Angular maneje el routing

## 🌐 Integración con CloudFront (Opcional)

Para mejor performance y HTTPS:

```powershell
# 1. Crear distribución CloudFront
# 2. Origin: eshop-fe.s3.us-east-1.amazonaws.com
# 3. Comportamiento: Redirect HTTP to HTTPS
# 4. Error Pages: 403 → /index.html, 404 → /index.html
```

## 📊 Monitoreo

### Ver logs de S3
```powershell
# Habilitar Server Access Logging en S3 console
```

### Métricas de CloudWatch
```powershell
# Monitorear requests, bytes transferidos
aws cloudwatch get-metric-statistics --namespace AWS/S3 --metric-name NumberOfObjects --dimensions Name=BucketName,Value=eshop-fe --start-time 2025-01-01T00:00:00Z --end-time 2025-12-31T23:59:59Z --period 86400 --statistics Average
```

## 📝 Notas

- El deploy elimina archivos viejos (`--delete` flag)
- Los archivos con hash en el nombre cachean por 1 año
- El index.html nunca se cachea (siempre fresh)
- Región por defecto: `us-east-1`

## 🔒 Seguridad

- ✅ Usar IAM roles con permisos mínimos
- ✅ No commitear credenciales AWS
- ✅ Rotar Access Keys periódicamente
- ✅ Habilitar MFA en cuenta AWS
- ✅ Usar CloudFront + ACM para HTTPS

---

**Última actualización:** Noviembre 2025  
**Bucket:** eshop-fe  
**Región:** us-east-1
