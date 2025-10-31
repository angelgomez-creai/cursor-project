# GitHub Actions Workflows

## 📋 Workflows Disponibles

### 1. Backend CI/CD (`backend-ci-cd.yml`)

Pipeline completo para el backend con:
- ✅ Linting y format checking
- ✅ Security scanning (Bandit + Safety)
- ✅ Testing con pytest
- ✅ Docker multi-platform build
- ✅ Push a GitHub Container Registry
- ✅ Deployment automático a AWS ECS

### 2. Frontend CI/CD (`frontend-ci-cd.yml`)

Pipeline para el frontend con:
- ✅ Linting (ESLint)
- ✅ Type checking (TypeScript)
- ✅ Build
- ✅ Docker multi-platform build
- ✅ Push a GitHub Container Registry

## 🔧 Configuración

### Secrets Requeridos

#### Para Backend

```yaml
# AWS ECS Deployment
AWS_ACCESS_KEY_ID: tu-access-key
AWS_SECRET_ACCESS_KEY: tu-secret-key
AWS_REGION: us-east-1
AWS_ECS_CLUSTER: ecommerce-cluster
AWS_ECS_SERVICE: ecommerce-backend-service
AWS_ECS_TASK_DEFINITION: backend-task-def.json

# Security Scanning (opcional)
SAFETY_API_KEY: tu-safety-api-key
```

#### Para Frontend

```yaml
VITE_API_URL: https://api.example.com
```

### Permisos de Repository

Asegúrate de habilitar:
1. **GitHub Container Registry**: Settings → Packages → Allow packages
2. **Actions**: Settings → Actions → Allow actions
3. **Secrets**: Settings → Secrets and variables → Actions

## 🚀 Uso

### Trigger Automático

El workflow se ejecuta automáticamente en:
- Push a `main` o `develop`
- Pull requests a `main` o `develop`
- Cambios en archivos del backend/frontend

### Trigger Manual

```bash
# Desde GitHub UI
Actions → Backend CI/CD Pipeline → Run workflow

# O desde CLI
gh workflow run backend-ci-cd.yml
```

## 📊 Jobs del Workflow Backend

### 1. Lint
- Black format check
- isort import sorting
- Flake8 linting
- MyPy type checking

### 2. Security
- Bandit security linting
- Safety dependency check

### 3. Test
- pytest con coverage
- PostgreSQL service
- Redis service
- Coverage reports a Codecov

### 4. Build and Push
- Docker multi-platform (amd64, arm64)
- Push a GHCR con tags
- Cache de layers

### 5. Manifest
- Crea manifest multi-platform

### 6. Deploy
- Deployment a AWS ECS
- Verificación de deployment
- Health check

## 🔍 Ver Resultados

```bash
# Ver workflows en ejecución
gh run list

# Ver detalles de un workflow
gh run view <run-id>

# Ver logs
gh run watch <run-id>
```

## 📚 Documentación Adicional

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS ECS Deployment](https://docs.aws.amazon.com/ecs/)
- [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

