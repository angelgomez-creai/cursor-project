# Frontend CI/CD Workflow Guide

## 📋 Descripción

Workflow completo de GitHub Actions para el frontend del e-commerce con:
- ✅ Linting con ESLint
- ✅ Testing con Jest
- ✅ Build optimizado
- ✅ Lighthouse CI para performance
- ✅ Docker multi-platform build
- ✅ Deployment a S3/CloudFront

## 🏗️ Estructura del Pipeline

```
Lint → Test → Build → Lighthouse → Docker Build → Manifest → Deploy
```

### Jobs del Workflow

1. **lint** - Code quality checks
2. **test** - Jest testing con coverage
3. **build** - Build optimizado
4. **lighthouse** - Performance audit (solo main)
5. **docker-build** - Docker multi-platform
6. **manifest** - Multi-platform manifest
7. **deploy** - S3/CloudFront deployment (solo main)

## 🔧 Configuración

### Secrets Requeridos

```yaml
# AWS S3/CloudFront
AWS_ACCESS_KEY_ID: AKIA...
AWS_SECRET_ACCESS_KEY: wJalr...
AWS_REGION: us-east-1
AWS_S3_BUCKET: your-bucket-name
AWS_CLOUDFRONT_DISTRIBUTION_ID: E1234567890ABC
AWS_CLOUDFRONT_DOMAIN: your-domain.cloudfront.net

# Build (opcional)
VITE_API_URL: https://api.example.com
```

### Dependencias Agregadas

El workflow requiere estas dependencias en `package.json`:

```json
{
  "devDependencies": {
    "@testing-library/react": "^14.1.2",
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/user-event": "^14.5.1",
    "@types/jest": "^29.5.11",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "ts-jest": "^29.1.1",
    "identity-obj-proxy": "^3.0.0"
  }
}
```

## 🧪 Testing con Jest

### Configuración

- **Config file**: `jest.config.js`
- **Setup file**: `src/setupTests.ts`
- **Coverage threshold**: 70% mínimo

### Comandos

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# Coverage
pnpm test:coverage

# CI mode
pnpm test:ci
```

## 📊 Lighthouse CI

### Configuración

- **Config file**: `.lighthouserc.js`
- **Preset**: desktop
- **Assertions**: Performance, Accessibility, Best Practices, SEO

### Thresholds

- Performance: 0.8 mínimo
- Accessibility: 0.9 mínimo
- Best Practices: 0.9 mínimo
- SEO: 0.9 mínimo

## 🐳 Docker Build

- **Multi-platform**: linux/amd64, linux/arm64
- **Registry**: GitHub Container Registry
- **Tags**: latest, branch-name, SHA
- **Cache**: GitHub Actions cache

## ☁️ S3/CloudFront Deployment

### Características

- ✅ Sync optimizado (cache headers diferentes para assets y HTML)
- ✅ Invalidación automática de CloudFront cache
- ✅ Verificación de deployment

### Cache Strategy

- **Assets estáticos**: 1 año de caché (`max-age=31536000, immutable`)
- **HTML files**: Sin caché (`no-cache, no-store, must-revalidate`)
- **CloudFront**: Invalidación completa en cada deploy

## 🚀 Uso

### Automático

- Push a `main` → Ejecuta todo (incluyendo deploy)
- Push a `develop` → Ejecuta hasta build (sin deploy)
- Pull Request → Ejecuta hasta test (sin build/deploy)

### Manual

```bash
# Desde GitHub UI
Actions → Frontend CI/CD Pipeline → Run workflow

# Seleccionar environment (staging/production)
```

## 📈 Artefactos Generados

- `frontend-dist` - Build artifacts (30 días)
- `coverage-html` - Coverage reports
- `lighthouse-reports` - Lighthouse reports (30 días)

## 🔍 Ver Resultados

```bash
# Ver workflows
gh run list --workflow=frontend-ci-cd.yml

# Ver detalles
gh run view <run-id>

# Ver logs
gh run watch <run-id>
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [AWS S3 Deployment](https://docs.aws.amazon.com/s3/)
- [CloudFront](https://docs.aws.amazon.com/cloudfront/)

