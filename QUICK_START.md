# E-commerce Quick Start Guide

## 🚀 Inicio Rápido con Docker Compose

### 1. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar con tus valores (IMPORTANTE: Cambiar contraseñas)
nano .env  # o usar tu editor preferido
```

### 2. Iniciar Servicios

```bash
# Producción
docker-compose up -d

# O desarrollo
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Verificar Servicios

```bash
# Ver estado
docker-compose ps

# Ver logs
docker-compose logs -f
```

### 4. Acceder a la Aplicación

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api/v1/
- **API Docs**: http://localhost/api/docs
- **Health Check**: http://localhost/health

## 📋 Servicios Disponibles

| Servicio   | Puerto Interno | Puerto Externo | Descripción          |
|-----------|----------------|----------------|----------------------|
| Frontend  | 80             | -              | React + Nginx        |
| Backend   | 8000           | -              | FastAPI              |
| PostgreSQL| 5432           | 5432 (dev)     | Base de datos        |
| Redis     | 6379           | 6379 (dev)     | Caché                |
| Nginx     | 80/443         | 80/443         | Reverse proxy        |

## 🔧 Comandos Útiles

```bash
# Ver logs de todos los servicios
make logs

# Ver logs de un servicio específico
make logs-backend
make logs-frontend

# Acceder a shell
make shell-backend
make shell-postgres
make shell-redis

# Backup de base de datos
make backup

# Parar servicios
make down

# Limpiar todo
make clean
```

## 🔐 Variables de Entorno Críticas

Asegúrate de configurar en `.env`:

```bash
POSTGRES_PASSWORD=strong_password_here
REDIS_PASSWORD=redis_password_here
JWT_SECRET_KEY=your-super-secret-key-here
```

## 📚 Más Información

- `README_DOCKER_COMPOSE.md` - Documentación completa
- `docker-compose.yml` - Configuración de producción
- `docker-compose.dev.yml` - Configuración de desarrollo

