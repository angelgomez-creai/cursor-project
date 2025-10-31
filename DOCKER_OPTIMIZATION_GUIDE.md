# Docker Optimization Guide - E-commerce

## 📊 Optimizaciones Aplicadas

### Backend Dockerfile

#### Cambios Principales:
1. ✅ **Python Alpine** (antes: slim) - Reducción ~200MB
2. ✅ **Multi-stage mejorado** - Separación clara de build y runtime
3. ✅ **Eliminación de build tools** en producción
4. ✅ **Limpieza de cachés** - pip cache, __pycache__, .pyc
5. ✅ **Usuario no-root** creado temprano
6. ✅ **Permisos mínimos** - chmod 755 solo en lo necesario
7. ✅ **Una sola capa** para instalación de dependencias

#### Tamaño Reducido:
- **Antes**: ~450MB (python:3.11-slim)
- **Después**: ~150MB (python:3.11-alpine)
- **Reducción**: ~66% más pequeño

### Frontend Dockerfile

#### Cambios Principales:
1. ✅ **Corepack para pnpm** - Más eficiente que npm install
2. ✅ **Limpieza post-build** - Elimina node_modules y cache
3. ✅ **Eliminación de source maps** en producción
4. ✅ **Usuario nginx** - Ya existe en nginx:alpine
5. ✅ **Assets optimizados** - Solo copia dist/
6. ✅ **pnpm store prune** - Limpia cache después de build

#### Tamaño Reducido:
- **Antes**: ~50MB (con nginx:alpine)
- **Después**: ~35MB (optimizado)
- **Reducción**: ~30% más pequeño

## 🔒 Mejoras de Seguridad

### Backend
- ✅ Usuario no-root (`appuser` UID 1000)
- ✅ Permisos mínimos (755)
- ✅ Sin herramientas de build en producción
- ✅ Eliminación de información sensible (__pycache__)

### Frontend
- ✅ Usuario nginx (no-root, UID 101)
- ✅ Permisos restrictivos
- ✅ Sin source maps en producción
- ✅ Assets readonly

## 📦 .dockerignore Optimizado

### Backend
- ✅ Excluye archivos de desarrollo
- ✅ Excluye documentación
- ✅ Excluye tests en producción
- ✅ Excluye archivos grandes (.zip, .tar)

### Frontend
- ✅ Excluye node_modules (se instala en build)
- ✅ Excluye source maps
- ✅ Excluye archivos de desarrollo
- ✅ Excluye cache de build tools

## 🎯 Mejores Prácticas Aplicadas

### 1. Layer Caching
```dockerfile
# ✅ BUENO - Dependencies primero
COPY requirements.txt .
RUN pip install ...

# ❌ MALO - Código primero
COPY src/ .
COPY requirements.txt .
RUN pip install ...
```

### 2. Minimal Base Images
```dockerfile
# ✅ BUENO
FROM python:3.11-alpine

# ❌ MALO (para producción)
FROM python:3.11
```

### 3. Single RUN Commands
```dockerfile
# ✅ BUENO - Una sola capa
RUN apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# ❌ MALO - Múltiples capas
RUN apk add --no-cache curl
RUN rm -rf /var/cache/apk/*
```

### 4. Cleanup in Same Layer
```dockerfile
# ✅ BUENO
RUN pip install ... && \
    pip cache purge && \
    find ... -delete

# ❌ MALO
RUN pip install ...
RUN pip cache purge
```

### 5. Non-Root User
```dockerfile
# ✅ BUENO - Usuario creado temprano
RUN adduser -S appuser
USER appuser

# ❌ MALO - Usuario al final (puede tener permisos innecesarios)
# ... código ...
USER appuser
```

## 📈 Comparación de Tamaños

### Backend
| Versión | Tamaño | Mejora |
|---------|--------|--------|
| Original (slim) | ~450MB | - |
| Optimizado (alpine) | ~150MB | 66% ↓ |

### Frontend
| Versión | Tamaño | Mejora |
|---------|--------|--------|
| Original | ~50MB | - |
| Optimizado | ~35MB | 30% ↓ |

## 🔍 Verificar Tamaños

```bash
# Ver tamaño de imágenes
docker images | grep ecommerce

# Ver tamaño por layer
docker history ecommerce-backend:prod

# Comparar tamaños
docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"
```

## 🚀 Build Optimizado

```bash
# Build con cache
docker build --target production -t ecommerce-backend:prod ./backend

# Build sin cache (para verificar)
docker build --no-cache --target production -t ecommerce-backend:prod ./backend

# Ver tamaño final
docker images ecommerce-backend:prod
```

## 📝 Checklist de Optimización

### Backend
- [x] Usar Alpine Linux
- [x] Multi-stage build
- [x] Limpiar __pycache__
- [x] Limpiar pip cache
- [x] Eliminar build tools en producción
- [x] Usuario no-root
- [x] Permisos mínimos
- [x] .dockerignore completo

### Frontend
- [x] Usar Alpine Linux
- [x] Multi-stage build
- [x] Limpiar pnpm cache
- [x] Eliminar source maps
- [x] Eliminar node_modules post-build
- [x] Usuario no-root
- [x] .dockerignore completo
- [x] Solo copiar dist/ en producción

## 🔐 Security Hardening

### Imágenes
- ✅ Imágenes base oficiales y actualizadas
- ✅ No secrets en imágenes
- ✅ Usuarios no-root
- ✅ Permisos mínimos
- ✅ Sin herramientas de debug en producción

### Runtime
- ✅ Read-only filesystem (opcional, comentado)
- ✅ Health checks
- ✅ Resource limits
- ✅ Network isolation

## 📚 Recursos

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Alpine Linux](https://alpinelinux.org/)
- [OWASP Docker Security](https://owasp.org/www-project-docker-top-10/)

