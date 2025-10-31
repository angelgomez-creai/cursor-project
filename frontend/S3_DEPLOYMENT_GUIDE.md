# S3/CloudFront Deployment Guide

## 📋 Prerrequisitos

### 1. Crear S3 Bucket

```bash
aws s3 mb s3://your-bucket-name \
  --region us-east-1

# Habilitar website hosting (opcional, si no usas CloudFront)
aws s3 website s3://your-bucket-name \
  --index-document index.html \
  --error-document index.html
```

### 2. Configurar Bucket Policy

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### 3. Crear CloudFront Distribution

1. Ir a CloudFront Console
2. Crear nueva distribution
3. **Origin Domain**: Seleccionar tu S3 bucket
4. **Default Root Object**: `index.html`
5. **Viewer Protocol Policy**: Redirect HTTP to HTTPS
6. **Allowed HTTP Methods**: GET, HEAD, OPTIONS
7. Guardar y esperar a que se propague

### 4. Obtener IDs Necesarios

```bash
# CloudFront Distribution ID
aws cloudfront list-distributions \
  --query "DistributionList.Items[*].[Id,DomainName]" \
  --output table

# S3 Bucket name
aws s3 ls
```

## 🔐 Configurar Secrets en GitHub

```yaml
AWS_ACCESS_KEY_ID: AKIA...
AWS_SECRET_ACCESS_KEY: wJalr...
AWS_REGION: us-east-1
AWS_S3_BUCKET: your-bucket-name
AWS_CLOUDFRONT_DISTRIBUTION_ID: E1234567890ABC
AWS_CLOUDFRONT_DOMAIN: d1234567890.cloudfront.net
```

## 📦 Estrategia de Caché

### Assets Estáticos (JS, CSS, imágenes)

```
Cache-Control: public, max-age=31536000, immutable
```

- **1 año de caché**
- **Immutable**: No se verifica si hay cambios
- Aplicado a: `.js`, `.css`, `.png`, `.jpg`, etc.

### HTML Files

```
Cache-Control: no-cache, no-store, must-revalidate
```

- **Sin caché**: Siempre se obtiene la última versión
- Aplicado a: `*.html`, `service-worker.js`

### CloudFront Invalidation

En cada deploy se invalida todo el caché:

```bash
aws cloudfront create-invalidation \
  --distribution-id E1234567890ABC \
  --paths "/*"
```

## 🚀 Deployment Flow

1. **Build** → Genera `frontend/dist/`
2. **Deploy Assets** → S3 sync con caché de 1 año
3. **Deploy HTML** → S3 sync sin caché
4. **Invalidate CloudFront** → Limpia caché CDN
5. **Verify** → Confirma deployment

## 🔍 Verificar Deployment

```bash
# Ver archivos en S3
aws s3 ls s3://your-bucket-name/ --recursive

# Ver contenido de un archivo
aws s3 cp s3://your-bucket-name/index.html - | head -20

# Verificar CloudFront
curl -I https://your-domain.cloudfront.net
```

## 🐛 Troubleshooting

### Deployment falla

- ✅ Verificar AWS credentials
- ✅ Verificar permisos IAM (s3:PutObject, cloudfront:CreateInvalidation)
- ✅ Verificar que bucket existe
- ✅ Verificar que CloudFront distribution existe

### CloudFront no actualiza

- ✅ Esperar propagación (puede tardar 10-15 minutos)
- ✅ Verificar invalidación en CloudFront console
- ✅ Verificar que HTML files no tienen caché en S3

### Assets no cargan

- ✅ Verificar CORS en S3 (si es necesario)
- ✅ Verificar bucket policy
- ✅ Verificar paths relativos en el código

## 📚 Recursos

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [S3 Deployment Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

