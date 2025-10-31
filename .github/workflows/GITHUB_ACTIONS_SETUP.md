# GitHub Actions Setup Guide

## 🚀 Configuración Inicial

### 1. Habilitar GitHub Container Registry

1. Ir a **Settings** → **Packages**
2. Habilitar **GitHub Container Registry**
3. Configurar permisos de lectura/escritura

### 2. Configurar Secrets

Ir a **Settings** → **Secrets and variables** → **Actions**

#### Secrets Requeridos para Backend

```yaml
# AWS Credentials
AWS_ACCESS_KEY_ID: AKIA...
AWS_SECRET_ACCESS_KEY: wJalr...
AWS_REGION: us-east-1

# ECS Configuration
AWS_ECS_CLUSTER: ecommerce-cluster
AWS_ECS_SERVICE: ecommerce-backend-service
AWS_ECS_TASK_DEFINITION: ecommerce-backend-task-def

# Optional
SAFETY_API_KEY: tu-api-key (para safety check mejorado)
```

### 3. Configurar Environment Protection

1. Ir a **Settings** → **Environments**
2. Crear environments: `staging`, `production`
3. Agregar required reviewers para production
4. Configurar deployment branches

## 📋 Workflow Files

### Backend CI/CD

`.github/workflows/backend-ci-cd.yml`

**Jobs:**
1. `lint` - Code quality
2. `security` - Security scanning
3. `test` - Unit tests
4. `build-and-push` - Docker build
5. `manifest` - Multi-platform manifest
6. `deploy` - AWS ECS deployment

### Frontend CI/CD

`.github/workflows/frontend-ci-cd.yml`

**Jobs:**
1. `lint` - ESLint + TypeScript
2. `build` - Build application
3. `docker-build` - Docker build

## 🔍 Verificación

### Probar Workflow

```bash
# Crear un commit de prueba
git commit --allow-empty -m "test: trigger CI/CD"
git push origin develop

# Ver workflow en GitHub
# Actions tab → Backend CI/CD Pipeline
```

### Verificar Build

```bash
# Ver imágenes en GHCR
gh api user/packages?package_type=container

# O desde GitHub UI
# Packages → ecommerce-backend
```

## 🐛 Troubleshooting

### Workflow no se ejecuta

- ✅ Verificar que `.github/workflows/` existe
- ✅ Verificar sintaxis YAML (usar yamllint)
- ✅ Verificar que los paths están correctos

### Build falla

- ✅ Verificar que Dockerfile existe
- ✅ Verificar que .dockerignore está configurado
- ✅ Ver logs del workflow para detalles

### Deploy falla

- ✅ Verificar AWS credentials
- ✅ Verificar que ECS cluster existe
- ✅ Verificar permisos IAM
- ✅ Verificar task definition

## 📚 Recursos

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [AWS ECS Docs](https://docs.aws.amazon.com/ecs/)
- [Docker Buildx](https://docs.docker.com/buildx/)

