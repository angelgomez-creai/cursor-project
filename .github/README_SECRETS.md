# 🔐 GitHub Secrets Configuration

## 📚 Documentación

Esta carpeta contiene la documentación completa para configurar todos los secrets necesarios en GitHub Actions.

### Archivos

- **`SECRETS_GUIDE.md`** - Guía completa y detallada de todos los secrets
- **`SECRETS_QUICK_REFERENCE.md`** - Referencia rápida con tabla de secrets
- **`workflows/verify-secrets.yml`** - Workflow para verificar configuración de secrets

### Scripts de Configuración

En `scripts/`:
- **`setup-aws-iam-user.sh`** - Script bash para crear usuario IAM (Linux/Mac)
- **`setup-aws-iam-user.ps1`** - Script PowerShell para crear usuario IAM (Windows)

---

## 🚀 Inicio Rápido

### 1. Configurar AWS IAM User

```bash
# Linux/Mac
./scripts/setup-aws-iam-user.sh github-actions us-east-1

# Windows
.\scripts\setup-aws-iam-user.ps1 -Username github-actions -Region us-east-1
```

### 2. Configurar Secrets en GitHub

Ir a: **Repository → Settings → Secrets and variables → Actions**

#### Secrets Obligatorios (Backend)

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_REGION`
- `AWS_ECS_CLUSTER`
- `AWS_ECS_SERVICE`
- `AWS_ECS_TASK_DEFINITION`

#### Secrets Obligatorios (Frontend)

- `AWS_ACCESS_KEY_ID` (compartido)
- `AWS_SECRET_ACCESS_KEY` (compartido)
- `AWS_REGION` (compartido)
- `AWS_S3_BUCKET`
- `AWS_CLOUDFRONT_DISTRIBUTION_ID`
- `AWS_CLOUDFRONT_DOMAIN`

#### Secrets Opcionales

- `VITE_API_URL` (frontend build, tiene default)
- `SAFETY_API_KEY` (backend security scan)

### 3. Verificar Configuración

```bash
# Usar el workflow de verificación
gh workflow run verify-secrets.yml -f environment=all
```

O desde GitHub UI: **Actions → Verify Secrets Configuration → Run workflow**

---

## 📋 Checklist Completo

Ver `SECRETS_GUIDE.md` para la lista completa con:
- Descripción de cada secret
- Cómo obtenerlo
- Ejemplos de valores
- Mejores prácticas de seguridad

---

## 🔒 Variables de Entorno de Producción

Las variables de entorno de producción (como `DATABASE_URL`, `JWT_SECRET_KEY`) deben configurarse en:

1. **AWS ECS Task Definition** (como environment variables o secrets)
2. **AWS Secrets Manager** (recomendado para valores sensibles)

Ver `.env.production.example` para la lista completa.

**⚠️ IMPORTANTE**: No configurar variables de entorno de producción como GitHub secrets. Configurar en ECS o Secrets Manager.

---

## 📞 Soporte

- Ver documentación completa en `SECRETS_GUIDE.md`
- Ver referencia rápida en `SECRETS_QUICK_REFERENCE.md`
- Usar workflow de verificación para diagnosticar problemas

