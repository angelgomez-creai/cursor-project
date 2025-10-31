# GitHub Secrets Configuration Guide

## 📋 Descripción

Guía completa para configurar todos los secrets necesarios en GitHub Actions para el e-commerce. Incluye AWS credentials, Docker registry tokens, variables de entorno de producción, y mejores prácticas de seguridad.

---

## 🔐 Lista Completa de Secrets

### Categorías

1. **AWS Credentials** (Backend + Frontend)
2. **AWS ECS** (Backend Deployment)
3. **AWS S3/CloudFront** (Frontend Deployment)
4. **Docker Registry** (GHCR)
5. **Security Tools** (Safety)
6. **Application Environment Variables** (Build/Production)
7. **Database & Redis** (Production)

---

## 1️⃣ AWS Credentials (Compartidas)

### `AWS_ACCESS_KEY_ID`
- **Descripción**: Access Key ID para autenticación con AWS
- **Requerido para**: Backend deployment (ECS), Frontend deployment (S3/CloudFront)
- **Tipo**: String
- **Formato**: `AKIAXXXXXXXXXXXXXXXX`
- **Ejemplo**: `AKIAIOSFODNN7EXAMPLE`

**Cómo obtenerlo:**
```bash
# Crear nuevo IAM User
aws iam create-user --user-name github-actions

# Crear Access Key
aws iam create-access-key --user-name github-actions

# Guardar Access Key ID y Secret Access Key
```

**Mejores prácticas:**
- ✅ Crear usuario IAM dedicado para CI/CD
- ✅ Aplicar principio de menor privilegio
- ✅ Rotar keys periódicamente (cada 90 días)
- ❌ No usar root account credentials
- ❌ No compartir entre proyectos

---

### `AWS_SECRET_ACCESS_KEY`
- **Descripción**: Secret Access Key para autenticación con AWS
- **Requerido para**: Backend deployment (ECS), Frontend deployment (S3/CloudFront)
- **Tipo**: String (Secret)
- **Formato**: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`
- **Ejemplo**: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

**Cómo obtenerlo:**
```bash
# Ver Access Key después de crearlo
aws iam list-access-keys --user-name github-actions
```

**Mejores prácticas:**
- ✅ Guardar inmediatamente (solo se muestra una vez)
- ✅ Usar AWS Secrets Manager si es posible
- ✅ Habilitar MFA para el usuario
- ❌ Nunca commitear en el código
- ❌ No compartir entre ambientes

---

### `AWS_REGION`
- **Descripción**: Región de AWS donde están los recursos
- **Requerido para**: Backend deployment (ECS), Frontend deployment (S3/CloudFront)
- **Tipo**: String
- **Valor por defecto**: `us-east-1`
- **Valores comunes**:
  - `us-east-1` (N. Virginia)
  - `us-west-2` (Oregon)
  - `eu-west-1` (Ireland)
  - `ap-southeast-1` (Singapore)

**Configuración:**
```yaml
AWS_REGION: us-east-1
```

---

## 2️⃣ AWS ECS (Backend Deployment)

### `AWS_ECS_CLUSTER`
- **Descripción**: Nombre del cluster ECS donde se despliega el backend
- **Requerido para**: Backend deployment
- **Tipo**: String
- **Formato**: Nombre del cluster (sin ARN)
- **Ejemplo**: `ecommerce-backend-cluster`

**Cómo obtenerlo:**
```bash
# Listar clusters
aws ecs list-clusters

# Ver detalles
aws ecs describe-clusters --clusters ecommerce-backend-cluster
```

**Crear cluster (si no existe):**
```bash
aws ecs create-cluster --cluster-name ecommerce-backend-cluster \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy \
    capacityProvider=FARGATE,weight=1 \
    capacityProvider=FARGATE_SPOT,weight=1
```

---

### `AWS_ECS_SERVICE`
- **Descripción**: Nombre del servicio ECS
- **Requerido para**: Backend deployment
- **Tipo**: String
- **Ejemplo**: `ecommerce-backend-service`

**Cómo obtenerlo:**
```bash
# Listar servicios
aws ecs list-services --cluster ecommerce-backend-cluster

# Ver detalles
aws ecs describe-services \
  --cluster ecommerce-backend-cluster \
  --services ecommerce-backend-service
```

---

### `AWS_ECS_TASK_DEFINITION`
- **Descripción**: Ruta completa al archivo de task definition JSON
- **Requerido para**: Backend deployment
- **Tipo**: String (file path o JSON)
- **Ejemplo**: `backend/task-definition.json`

**Estructura del archivo:**
```json
{
  "family": "ecommerce-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "ghcr.io/username/repo/backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "DATABASE_URL",
          "value": "postgresql://user:pass@host:5432/db"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/ecommerce-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

---

## 3️⃣ AWS S3/CloudFront (Frontend Deployment)

### `AWS_S3_BUCKET`
- **Descripción**: Nombre del bucket S3 donde se despliega el frontend
- **Requerido para**: Frontend deployment
- **Tipo**: String
- **Formato**: Nombre del bucket (sin s3://)
- **Ejemplo**: `ecommerce-frontend-prod` o `my-ecommerce-app`

**Cómo crearlo:**
```bash
# Crear bucket
aws s3 mb s3://ecommerce-frontend-prod --region us-east-1

# Habilitar versioning (opcional pero recomendado)
aws s3api put-bucket-versioning \
  --bucket ecommerce-frontend-prod \
  --versioning-configuration Status=Enabled

# Habilitar encriptación
aws s3api put-bucket-encryption \
  --bucket ecommerce-frontend-prod \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

**Bucket Policy (para acceso público):**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::ecommerce-frontend-prod/*"
    }
  ]
}
```

---

### `AWS_CLOUDFRONT_DISTRIBUTION_ID`
- **Descripción**: ID de la distribución de CloudFront
- **Requerido para**: Frontend deployment (invalidación de caché)
- **Tipo**: String
- **Formato**: ID de distribución (comienza con E)
- **Ejemplo**: `E1234567890ABC`

**Cómo obtenerlo:**
```bash
# Listar distribuciones
aws cloudfront list-distributions \
  --query "DistributionList.Items[*].[Id,DomainName,Origins.Items[0].DomainName]" \
  --output table

# Ver detalles
aws cloudfront get-distribution --id E1234567890ABC
```

**Crear distribución:**
```bash
# Crear distribución desde AWS Console o CLI
# Origin Domain: tu-bucket.s3.amazonaws.com
# Default Root Object: index.html
# Viewer Protocol Policy: Redirect HTTP to HTTPS
```

---

### `AWS_CLOUDFRONT_DOMAIN`
- **Descripción**: Domain name de CloudFront
- **Requerido para**: Frontend deployment (verificación)
- **Tipo**: String
- **Formato**: `d1234567890.cloudfront.net`
- **Ejemplo**: `d1234567890abc.cloudfront.net`

**Cómo obtenerlo:**
```bash
# Ver domain name de distribución
aws cloudfront get-distribution --id E1234567890ABC \
  --query "Distribution.DomainName"
```

---

## 4️⃣ Docker Registry (GitHub Container Registry)

### `GITHUB_TOKEN`
- **Descripción**: Token de GitHub para autenticación con GHCR
- **Requerido para**: Backend Docker build/push, Frontend Docker build/push
- **Tipo**: Auto-generado por GitHub Actions
- **Permisos**: `packages: write` (automático en workflows)
- **Nota**: Este secret se genera automáticamente, NO necesitas configurarlo manualmente

**Verificación automática:**
- ✅ GitHub Actions genera `GITHUB_TOKEN` automáticamente
- ✅ Tiene permisos de `packages: write` en workflows
- ✅ No requiere configuración manual

**Si necesitas usar un PAT (Personal Access Token) personalizado:**
```bash
# Crear PAT en GitHub
# Settings > Developer settings > Personal access tokens > Tokens (classic)
# Scope: write:packages, read:packages

# Configurar como secret (no recomendado, usar GITHUB_TOKEN)
```

---

## 5️⃣ Security Tools

### `SAFETY_API_KEY`
- **Descripción**: API Key para Safety (verificación de vulnerabilidades en Python)
- **Requerido para**: Backend security scanning (opcional pero recomendado)
- **Tipo**: String (opcional)
- **Formato**: API key de Safety
- **Ejemplo**: `safety-api-key-12345`

**Cómo obtenerlo:**
1. Ir a [pyup.io/safety](https://pyup.io/safety)
2. Crear cuenta
3. Obtener API key desde dashboard
4. Configurar como secret

**Nota**: Puedes ejecutar Safety sin API key, pero tendrás funcionalidad limitada.

---

## 6️⃣ Application Environment Variables (Build/Production)

### `VITE_API_URL`
- **Descripción**: URL del API backend para el frontend
- **Requerido para**: Frontend build (opcional, tiene default)
- **Tipo**: String
- **Default**: `http://localhost:8000`
- **Ejemplo (Production)**: `https://api.ecommerce.com`
- **Ejemplo (Staging)**: `https://api-staging.ecommerce.com`

**Configuración por ambiente:**
```yaml
# Production
VITE_API_URL: https://api.ecommerce.com

# Staging
VITE_API_URL: https://api-staging.ecommerce.com

# Development (default)
# No configurar, usa http://localhost:8000
```

---

### `DATABASE_URL` (Production)
- **Descripción**: URL completa de conexión a PostgreSQL
- **Requerido para**: Backend production deployment (configurar en ECS task definition, no como secret)
- **Tipo**: String
- **Formato**: `postgresql://user:password@host:port/database`
- **Ejemplo**: `postgresql://app_user:secure_password@prod-db.region.rds.amazonaws.com:5432/ecommerce_db`

**⚠️ IMPORTANTE**: Configurar en ECS task definition como environment variable, NO como GitHub secret (seguridad).

**Cómo configurar en ECS:**
```json
{
  "containerDefinitions": [{
    "environment": [
      {
        "name": "DATABASE_URL",
        "value": "postgresql://..."
      }
    ],
    "secrets": [
      {
        "name": "DATABASE_URL",
        "valueFrom": "arn:aws:secretsmanager:region:account:secret:db-url"
      }
    ]
  }]
}
```

---

### `REDIS_URL` (Production)
- **Descripción**: URL de conexión a Redis
- **Requerido para**: Backend production deployment
- **Tipo**: String
- **Formato**: `redis://host:port` o `rediss://host:port` (SSL)
- **Ejemplo**: `redis://prod-redis.region.cache.amazonaws.com:6379`

**Configurar en ECS task definition o AWS Secrets Manager.**

---

### `JWT_SECRET_KEY` (Production)
- **Descripción**: Secret key para firmar tokens JWT
- **Requerido para**: Backend production deployment
- **Tipo**: String (Secret, mínimo 32 caracteres)
- **Formato**: Random string segura
- **Ejemplo**: `your-super-secret-jwt-key-min-32-chars-long`

**Generar secret seguro:**
```bash
# Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# OpenSSL
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**⚠️ IMPORTANTE**: Configurar en AWS Secrets Manager o ECS task definition secrets, NO como GitHub secret.

---

### `REFRESH_TOKEN_SECRET` (Production)
- **Descripción**: Secret key para refresh tokens
- **Requerido para**: Backend production deployment
- **Tipo**: String (Secret)
- **Formato**: Random string segura
- **Ejemplo**: Generar igual que JWT_SECRET_KEY

---

### `ENVIRONMENT`
- **Descripción**: Ambiente de ejecución
- **Requerido para**: Backend production deployment
- **Tipo**: String
- **Valores**: `production`, `staging`, `development`
- **Ejemplo**: `production`

---

### `DEBUG`
- **Descripción**: Modo debug
- **Requerido para**: Backend production deployment
- **Tipo**: Boolean/String
- **Valores**: `false`, `true`, `0`, `1`
- **Ejemplo**: `false` (production)

---

### `CORS_ORIGINS` (Production)
- **Descripción**: Orígenes permitidos para CORS
- **Requerido para**: Backend production deployment
- **Tipo**: String (comma-separated)
- **Ejemplo**: `https://ecommerce.com,https://www.ecommerce.com`

---

## 📝 Configurar Secrets en GitHub

### Método 1: GitHub Web UI

1. Ir a tu repositorio en GitHub
2. **Settings** > **Secrets and variables** > **Actions**
3. Click en **New repository secret**
4. Ingresar:
   - **Name**: Nombre del secret (ej: `AWS_ACCESS_KEY_ID`)
   - **Secret**: Valor del secret
5. Click **Add secret**

### Método 2: GitHub CLI

```bash
# Instalar GitHub CLI
# macOS: brew install gh
# Linux: Ver https://github.com/cli/cli

# Autenticar
gh auth login

# Agregar secret
gh secret set AWS_ACCESS_KEY_ID --body "AKIA..."

# Listar secrets
gh secret list

# Ver secret (solo metadata, no el valor)
gh secret list --json name,updatedAt
```

### Método 3: GitHub API

```bash
# Crear secret
curl -X PUT \
  -H "Authorization: token YOUR_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/USERNAME/REPO/actions/secrets/AWS_ACCESS_KEY_ID \
  -d '{"encrypted_value":"ENCRYPTED_VALUE","key_id":"PUBLIC_KEY_ID"}'

# Obtener public key para encriptar
curl -H "Authorization: token YOUR_TOKEN" \
  https://api.github.com/repos/USERNAME/REPO/actions/secrets/public-key
```

---

## ✅ Checklist de Configuración

### Secrets Obligatorios (Backend)

- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`
- [ ] `AWS_REGION`
- [ ] `AWS_ECS_CLUSTER`
- [ ] `AWS_ECS_SERVICE`
- [ ] `AWS_ECS_TASK_DEFINITION`
- [ ] `SAFETY_API_KEY` (opcional pero recomendado)

### Secrets Obligatorios (Frontend)

- [ ] `AWS_ACCESS_KEY_ID`
- [ ] `AWS_SECRET_ACCESS_KEY`
- [ ] `AWS_REGION`
- [ ] `AWS_S3_BUCKET`
- [ ] `AWS_CLOUDFRONT_DISTRIBUTION_ID`
- [ ] `AWS_CLOUDFRONT_DOMAIN`
- [ ] `VITE_API_URL` (opcional, tiene default)

### Secrets Automáticos

- [x] `GITHUB_TOKEN` (generado automáticamente)

### Variables de Entorno de Producción

**Configurar en ECS Task Definition o AWS Secrets Manager:**

- [ ] `DATABASE_URL`
- [ ] `REDIS_URL`
- [ ] `JWT_SECRET_KEY`
- [ ] `REFRESH_TOKEN_SECRET`
- [ ] `ENVIRONMENT`
- [ ] `DEBUG`
- [ ] `CORS_ORIGINS`

---

## 🔒 Mejores Prácticas de Seguridad

### 1. Principio de Menor Privilegio

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecs:UpdateService",
        "ecs:DescribeServices",
        "ecs:DescribeTaskDefinition"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::ecommerce-frontend-prod",
        "arn:aws:s3:::ecommerce-frontend-prod/*"
      ]
    }
  ]
}
```

### 2. Rotación de Secrets

- ✅ Rotar AWS keys cada 90 días
- ✅ Rotar JWT secrets anualmente
- ✅ Monitorear uso de secrets en CloudTrail

### 3. Uso de AWS Secrets Manager

Para secrets sensibles, usar AWS Secrets Manager:

```json
{
  "containerDefinitions": [{
    "secrets": [
      {
        "name": "DATABASE_URL",
        "valueFrom": "arn:aws:secretsmanager:region:account:secret:db-url"
      },
      {
        "name": "JWT_SECRET_KEY",
        "valueFrom": "arn:aws:secretsmanager:region:account:secret:jwt-secret"
      }
    ]
  }]
}
```

### 4. Environment Protection Rules

En GitHub, proteger environments con reglas:

1. **Settings** > **Environments**
2. Crear environment `production`
3. Agregar **Required reviewers**
4. Agregar **Wait timer** (opcional)
5. Agregar **Deployment branches** restriction

### 5. Audit Logging

- Habilitar CloudTrail en AWS
- Revisar logs de GitHub Actions
- Monitorear accesos a secrets

---

## 🧪 Verificar Configuración

### Verificar Secrets en GitHub

```bash
# Listar secrets (solo nombres)
gh secret list

# Verificar que existen
gh secret list --json name | jq '.[].name'
```

### Verificar AWS Access

```bash
# Verificar credenciales
aws sts get-caller-identity

# Verificar permisos ECS
aws ecs describe-services \
  --cluster ecommerce-backend-cluster \
  --services ecommerce-backend-service

# Verificar permisos S3
aws s3 ls s3://ecommerce-frontend-prod
```

### Test Local del Workflow

```bash
# Instalar act (GitHub Actions local runner)
# macOS: brew install act
# Linux: Ver https://github.com/nektos/act

# Test workflow localmente
act -s AWS_ACCESS_KEY_ID="test" -s AWS_SECRET_ACCESS_KEY="test"
```

---

## 📚 Recursos Adicionales

- [GitHub Secrets Documentation](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [AWS IAM Best Practices](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html)
- [AWS Secrets Manager](https://docs.aws.amazon.com/secretsmanager/)
- [ECS Task Definition](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/task_definitions.html)
- [S3 Deployment Best Practices](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)

---

## 🆘 Troubleshooting

### Secret no encontrado

**Error**: `Secret not found: AWS_ACCESS_KEY_ID`

**Solución**:
1. Verificar nombre exacto (case-sensitive)
2. Verificar que está en el repositorio correcto
3. Verificar permisos del workflow

### AWS Access Denied

**Error**: `AccessDenied: User is not authorized to perform: ecs:UpdateService`

**Solución**:
1. Verificar IAM policy del usuario
2. Verificar que tiene permisos correctos
3. Verificar región correcta

### Docker Push Failed

**Error**: `denied: permission_denied`

**Solución**:
1. Verificar `GITHUB_TOKEN` tiene permisos `packages:write`
2. Verificar que el workflow tiene permisos correctos
3. Verificar que el repositorio tiene Packages habilitado

---

## 📞 Soporte

Si tienes problemas configurando secrets:

1. Revisar logs del workflow
2. Verificar permisos en AWS IAM
3. Verificar configuración en GitHub
4. Consultar documentación oficial

