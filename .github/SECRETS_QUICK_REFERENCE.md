# GitHub Secrets - Quick Reference

## 🚀 Configuración Rápida

### Paso 1: Ir a GitHub Secrets

```
Repository → Settings → Secrets and variables → Actions → New repository secret
```

### Paso 2: Configurar Secrets

| Secret Name | Valor | Cómo Obtener |
|------------|-------|--------------|
| `AWS_ACCESS_KEY_ID` | `AKIA...` | AWS IAM Console → Users → Create Access Key |
| `AWS_SECRET_ACCESS_KEY` | `wJalr...` | AWS IAM Console → Users → Create Access Key |
| `AWS_REGION` | `us-east-1` | Tu región AWS |
| `AWS_ECS_CLUSTER` | `ecommerce-backend-cluster` | `aws ecs list-clusters` |
| `AWS_ECS_SERVICE` | `ecommerce-backend-service` | `aws ecs list-services --cluster <cluster>` |
| `AWS_ECS_TASK_DEFINITION` | `backend/task-definition.json` | Ruta al archivo task definition |
| `AWS_S3_BUCKET` | `ecommerce-frontend-prod` | `aws s3 ls` |
| `AWS_CLOUDFRONT_DISTRIBUTION_ID` | `E1234567890ABC` | `aws cloudfront list-distributions` |
| `AWS_CLOUDFRONT_DOMAIN` | `d1234...cloudfront.net` | CloudFront Console → Distribution |
| `VITE_API_URL` | `https://api.ecommerce.com` | URL de tu API backend |
| `SAFETY_API_KEY` | `safety-key-123` | pyup.io/safety (opcional) |

---

## 📋 Checklist por Workflow

### Backend CI/CD

**Obligatorios:**
- ✅ `AWS_ACCESS_KEY_ID`
- ✅ `AWS_SECRET_ACCESS_KEY`
- ✅ `AWS_REGION`
- ✅ `AWS_ECS_CLUSTER`
- ✅ `AWS_ECS_SERVICE`
- ✅ `AWS_ECS_TASK_DEFINITION`

**Opcionales:**
- ⚪ `SAFETY_API_KEY`

### Frontend CI/CD

**Obligatorios:**
- ✅ `AWS_ACCESS_KEY_ID`
- ✅ `AWS_SECRET_ACCESS_KEY`
- ✅ `AWS_REGION`
- ✅ `AWS_S3_BUCKET`
- ✅ `AWS_CLOUDFRONT_DISTRIBUTION_ID`
- ✅ `AWS_CLOUDFRONT_DOMAIN`

**Opcionales:**
- ⚪ `VITE_API_URL` (default: `http://localhost:8000`)

---

## 🔐 Secrets Automáticos

- ✅ `GITHUB_TOKEN` - Generado automáticamente por GitHub Actions

---

## 🛠️ Comandos Útiles

### Verificar Secrets Configurados

```bash
gh secret list
```

### Verificar AWS Access

```bash
aws sts get-caller-identity
```

### Listar Recursos AWS

```bash
# ECS Clusters
aws ecs list-clusters

# ECS Services
aws ecs list-services --cluster <cluster-name>

# S3 Buckets
aws s3 ls

# CloudFront Distributions
aws cloudfront list-distributions --query "DistributionList.Items[*].[Id,DomainName]"
```

---

## 📚 Documentación Completa

Ver `SECRETS_GUIDE.md` para documentación detallada.

