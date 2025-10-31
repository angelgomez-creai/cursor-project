# Docker Compose - E-commerce Complete Setup

## 📋 Descripción

Configuración completa de Docker Compose para el e-commerce que incluye:
- **Backend**: FastAPI con Clean Architecture
- **Frontend**: React + Vite con Nginx
- **PostgreSQL**: Base de datos principal
- **Redis**: Caché y sesiones
- **Nginx**: Reverse proxy con load balancing

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────┐
│              Nginx Reverse Proxy               │
│                  (Port 80/443)                 │
└─────────────────┬───────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
   ┌────▼────┐         ┌────▼────┐
   │Frontend │         │ Backend │
   │ (Nginx) │         │(FastAPI)│
   └─────────┘         └────┬────┘
                            │
            ┌───────────────┴───────────────┐
            │                               │
      ┌─────▼─────┐                  ┌─────▼─────┐
      │PostgreSQL │                  │   Redis   │
      └───────────┘                  └───────────┘
```

## 🚀 Uso Rápido

### Producción

```bash
# 1. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# 2. Iniciar todos los servicios
docker-compose up -d

# 3. Ver logs
docker-compose logs -f

# 4. Verificar servicios
docker-compose ps
```

### Desarrollo

```bash
# Iniciar entorno de desarrollo
docker-compose -f docker-compose.dev.yml up -d

# Ver logs
docker-compose -f docker-compose.dev.yml logs -f
```

## 📦 Servicios

### 1. PostgreSQL

- **Puerto**: 5432
- **Base de datos**: `ecommerce`
- **Usuario**: `ecommerce_user`
- **Volumen**: `postgres_data`

**Conexión**:
```bash
docker-compose exec postgres psql -U ecommerce_user -d ecommerce
```

### 2. Redis

- **Puerto**: 6379
- **Password**: Configurado en `.env`
- **Volumen**: `redis_data`

**Conexión**:
```bash
docker-compose exec redis redis-cli -a ${REDIS_PASSWORD}
```

### 3. Backend

- **Puerto interno**: 8000
- **Externo**: Acceso vía Nginx en `/api`
- **Health**: `http://localhost/health` (vía nginx) o `http://localhost:8000/health` (directo)
- **Volumen**: `backend_data`

**Endpoints**:
- API: `http://localhost/api/v1/`
- Health: `http://localhost/api/health`
- Docs: `http://localhost/api/docs` (si DEBUG=true)

### 4. Frontend

- **Puerto interno**: 80 (nginx)
- **Externo**: `http://localhost/` (vía nginx)
- **Volumen**: Assets en imagen

### 5. Nginx Reverse Proxy

- **HTTP**: Puerto 80
- **HTTPS**: Puerto 443 (configurar SSL)
- **Logs**: Volúmenes `nginx_logs` y `nginx_cache`

**Rutas**:
- `/` → Frontend
- `/api/*` → Backend
- `/health` → Health check

## 🔧 Configuración

### Variables de Entorno

Editar `.env` con tus valores:

```bash
# Database
POSTGRES_PASSWORD=strong_password_here
POSTGRES_USER=ecommerce_user
POSTGRES_DB=ecommerce

# Redis
REDIS_PASSWORD=redis_password_here

# JWT
JWT_SECRET_KEY=your-super-secret-key

# Domain
DOMAIN=yourdomain.com
CORS_ORIGINS=https://yourdomain.com
```

### Nginx Configuration

- **Main config**: `nginx/nginx.conf`
- **Server config**: `nginx/conf.d/default.conf`

Para HTTPS:
1. Colocar certificados en `nginx/ssl/`
2. Descomentar configuración HTTPS en `nginx/conf.d/default.conf`
3. Actualizar `DOMAIN` en `.env`

## 🧪 Health Checks

Todos los servicios incluyen health checks:

```bash
# Verificar estado de todos los servicios
docker-compose ps

# Health check individual
docker inspect ecommerce-backend | grep -A 10 Health
docker inspect ecommerce-postgres | grep -A 10 Health
docker inspect ecommerce-redis | grep -A 10 Health
```

## 📊 Monitoreo

### Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Servicio específico
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f nginx

# Últimas 100 líneas
docker-compose logs --tail=100 backend
```

### Estadísticas de recursos

```bash
# Uso de recursos
docker stats

# Estadísticas de un servicio
docker stats ecommerce-backend
```

## 🔐 Seguridad

### Checklist de Producción

- [ ] Cambiar todas las contraseñas en `.env`
- [ ] Usar `JWT_SECRET_KEY` fuerte y único
- [ ] Configurar HTTPS con certificados SSL
- [ ] Revisar `CORS_ORIGINS` en `.env`
- [ ] Configurar rate limiting según necesidades
- [ ] Habilitar logs centralizados
- [ ] Configurar backups de PostgreSQL
- [ ] Revisar security headers en nginx
- [ ] Actualizar imágenes Docker regularmente

### Rate Limiting

Configurado en nginx:
- **API**: 10 req/s con burst de 20
- **Auth**: 5 req/s con burst de 10
- **General**: 30 req/s con burst de 50

Ajustar en `nginx/conf.d/default.conf` según necesidades.

## 🔄 Comandos Útiles

### Inicio/Parada

```bash
# Iniciar servicios
docker-compose up -d

# Parar servicios
docker-compose down

# Parar y eliminar volúmenes
docker-compose down -v

# Reiniciar un servicio
docker-compose restart backend
```

### Build

```bash
# Rebuild todos los servicios
docker-compose build

# Rebuild sin cache
docker-compose build --no-cache

# Rebuild un servicio específico
docker-compose build backend
```

### Database

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U ecommerce_user ecommerce > backup.sql

# Restore PostgreSQL
docker-compose exec -T postgres psql -U ecommerce_user ecommerce < backup.sql

# Acceder a PostgreSQL
docker-compose exec postgres psql -U ecommerce_user -d ecommerce
```

### Redis

```bash
# Acceder a Redis CLI
docker-compose exec redis redis-cli -a ${REDIS_PASSWORD}

# Limpiar Redis
docker-compose exec redis redis-cli -a ${REDIS_PASSWORD} FLUSHALL

# Ver información de Redis
docker-compose exec redis redis-cli -a ${REDIS_PASSWORD} INFO
```

## 🐛 Troubleshooting

### Problemas comunes

1. **Servicios no inician**
   ```bash
   # Ver logs de error
   docker-compose logs
   
   # Verificar health checks
   docker-compose ps
   ```

2. **Base de datos no conecta**
   ```bash
   # Verificar PostgreSQL
   docker-compose exec postgres pg_isready -U ecommerce_user
   
   # Ver logs de PostgreSQL
   docker-compose logs postgres
   ```

3. **Nginx no proxy correctamente**
   ```bash
   # Test configuración nginx
   docker-compose exec nginx nginx -t
   
   # Ver logs de nginx
   docker-compose logs nginx
   ```

4. **Frontend no carga**
   ```bash
   # Verificar frontend
   docker-compose logs frontend
   
   # Rebuild frontend
   docker-compose build --no-cache frontend
   ```

### Limpiar todo

```bash
# Parar y eliminar todo
docker-compose down -v

# Eliminar imágenes también
docker-compose down -v --rmi all
```

## 📚 Recursos Adicionales

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [PostgreSQL Docker](https://hub.docker.com/_/postgres)
- [Redis Docker](https://hub.docker.com/_/redis)
- [Nginx Documentation](https://nginx.org/en/docs/)

