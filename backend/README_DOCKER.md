# Docker Setup - E-commerce Backend

## 📋 Descripción

Dockerfile multi-stage optimizado para el backend del e-commerce con Python 3.11.

## 🏗️ Estructura Multi-Stage

### Stages del Dockerfile

1. **base** - Python 3.11 slim con dependencias del sistema
2. **dependencies** - Instalación de dependencias Python
3. **builder** - Preparación de archivos de aplicación
4. **development** - Entorno de desarrollo con hot-reload
5. **production** - Build optimizado para producción

## 🚀 Uso

### Desarrollo

```bash
# Build para desarrollo
docker build --target development -t ecommerce-backend:dev .

# Run en desarrollo (con hot-reload)
docker run -p 8000:8000 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/main.py:/app/main.py \
  -e ENVIRONMENT=development \
  -e DEBUG=true \
  ecommerce-backend:dev
```

O usando docker-compose:

```bash
# Iniciar servicio de desarrollo
docker-compose up backend-dev

# Con logs
docker-compose up -d backend-dev && docker-compose logs -f backend-dev
```

### Producción

```bash
# Build para producción
docker build --target production -t ecommerce-backend:prod .

# Run en producción
docker run -d \
  -p 8000:8000 \
  --name ecommerce-backend \
  --restart unless-stopped \
  -e ENVIRONMENT=production \
  -e JWT_SECRET_KEY=your-secret-key \
  -e DATABASE_URL=sqlite:///./data/ecommerce.db \
  -v ecommerce-data:/app/data \
  ecommerce-backend:prod
```

O usando docker-compose:

```bash
# Iniciar servicio de producción
docker-compose up -d backend-prod

# Ver logs
docker-compose logs -f backend-prod
```

## 🔧 Características

### Seguridad
- ✅ Usuario no-root (`appuser` con UID 1000)
- ✅ Permisos mínimos en archivos
- ✅ Sin herramientas de desarrollo en producción
- ✅ Variables de entorno para secretos

### Optimizaciones
- ✅ Multi-stage build para imagen más pequeña
- ✅ Caché de layers de dependencias
- ✅ .dockerignore para excluir archivos innecesarios
- ✅ Sin cache de pip en producción

### Health Check
- ✅ Endpoint `/health` verificado automáticamente
- ✅ Intervalos configurables (15s producción, 30s desarrollo)
- ✅ Reintentos automáticos

### Performance
- ✅ Multiple workers en producción (4 workers)
- ✅ Logging optimizado (sin access logs en prod)
- ✅ Variables de entorno para configuración

## 📝 Variables de Entorno

### Desarrollo

```bash
ENVIRONMENT=development
DEBUG=true
RELOAD=true
LOG_LEVEL=DEBUG
DATABASE_URL=sqlite:///./data/ecommerce.db
JWT_SECRET_KEY=dev-secret-key
```

### Producción

```bash
ENVIRONMENT=production
DEBUG=false
RELOAD=false
LOG_LEVEL=INFO
DATABASE_URL=sqlite:///./data/ecommerce.db
JWT_SECRET_KEY=<strong-secret-key>
CORS_ORIGINS=https://yourdomain.com
```

## 🧪 Testing

### Ejecutar tests dentro del contenedor

```bash
# Desarrollo
docker-compose exec backend-dev pytest tests/ -v

# Con coverage
docker-compose exec backend-dev pytest tests/ --cov=src --cov-report=html
```

## 📊 Tamaño de Imagen

- **Development**: ~800MB (incluye herramientas de desarrollo)
- **Production**: ~450MB (optimizado)

## 🔍 Troubleshooting

### Ver logs del contenedor

```bash
# Logs en tiempo real
docker-compose logs -f backend-dev

# Últimas 100 líneas
docker-compose logs --tail=100 backend-dev
```

### Acceder al contenedor

```bash
# Shell interactivo
docker-compose exec backend-dev /bin/bash

# Como root (si es necesario)
docker-compose exec --user root backend-dev /bin/bash
```

### Rebuild completo

```bash
# Sin cache
docker-compose build --no-cache backend-dev

# Rebuild y restart
docker-compose up -d --build backend-dev
```

### Verificar health check

```bash
# Health check manual
docker inspect --format='{{.State.Health.Status}}' ecommerce-backend-dev

# Ver detalles del health check
docker inspect ecommerce-backend-dev | grep -A 10 Health
```

## 🐳 Docker Compose

### Servicios Disponibles

- **backend-dev**: Desarrollo con hot-reload
- **backend-prod**: Producción optimizada

### Volúmenes

- `backend-dev-db`: Base de datos desarrollo
- `backend-prod-db`: Base de datos producción

### Networking

- Red bridge `ecommerce-network` para comunicación entre servicios

## 🚨 Seguridad en Producción

### Checklist

- [ ] Cambiar `JWT_SECRET_KEY` por secreto fuerte
- [ ] Configurar `CORS_ORIGINS` correctamente
- [ ] Usar HTTPS en producción
- [ ] Configurar límites de recursos (CPU, memoria)
- [ ] Habilitar logging centralizado
- [ ] Configurar backups de base de datos
- [ ] Revisar permisos de archivos
- [ ] Actualizar dependencias regularmente

## 📚 Recursos Adicionales

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Python Docker Images](https://hub.docker.com/_/python)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)

