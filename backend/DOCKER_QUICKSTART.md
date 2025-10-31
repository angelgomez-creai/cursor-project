# Docker Quick Start Guide

## 🚀 Inicio Rápido

### 1. Desarrollo

```bash
# Build y run en un comando
docker-compose up --build backend-dev

# O usando Makefile
make build-dev
make run-dev
```

El backend estará disponible en: http://localhost:8000

### 2. Producción

```bash
# Build para producción
docker build --target production -t ecommerce-backend:prod .

# Run en producción
docker run -d \
  -p 8000:8000 \
  -e JWT_SECRET_KEY=your-secret-key \
  ecommerce-backend:prod
```

## 📋 Comandos Útiles

### Ver logs
```bash
docker-compose logs -f backend-dev
```

### Ejecutar tests
```bash
docker-compose exec backend-dev pytest tests/ -v
```

### Acceder al contenedor
```bash
docker-compose exec backend-dev /bin/bash
```

### Detener contenedores
```bash
docker-compose down
```

## 🔧 Variables de Entorno

Crear archivo `.env`:

```bash
ENVIRONMENT=development
JWT_SECRET_KEY=your-secret-key
DATABASE_URL=sqlite:///./data/ecommerce.db
```

## 📚 Más Información

Ver `README_DOCKER.md` para documentación completa.

