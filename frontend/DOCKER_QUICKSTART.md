# Docker Quick Start Guide - Frontend

## 🚀 Inicio Rápido

### 1. Desarrollo

```bash
# Build y run en un comando
docker-compose up --build frontend-dev

# O usando Makefile
make build-dev
make run-dev
```

El frontend estará disponible en: http://localhost:3000

### 2. Producción

```bash
# Build para producción
docker build --target production -t ecommerce-frontend:prod .

# Run en producción
docker run -d -p 80:80 ecommerce-frontend:prod
```

El frontend estará disponible en: http://localhost

## 📋 Comandos Útiles

### Ver logs
```bash
docker-compose logs -f frontend-dev
```

### Ver logs de nginx (producción)
```bash
docker-compose exec frontend-prod cat /var/log/nginx/error.log
```

### Acceder al contenedor
```bash
# Development
docker-compose exec frontend-dev /bin/sh

# Production
docker-compose exec frontend-prod /bin/sh
```

### Detener contenedores
```bash
docker-compose down
```

### Verificar health
```bash
curl http://localhost/health
```

## 🔧 Variables de Entorno

### Desarrollo

```bash
NODE_ENV=development
VITE_API_URL=http://localhost:8000
```

### Producción

```bash
NODE_ENV=production
```

## 📚 Más Información

Ver `README_DOCKER.md` para documentación completa.

