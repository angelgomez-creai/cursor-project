# Docker Setup - E-commerce Frontend

## 📋 Descripción

Dockerfile multi-stage optimizado para el frontend del e-commerce con Node.js 18, pnpm, y nginx.

## 🏗️ Estructura Multi-Stage

### Stages del Dockerfile

1. **base** - Node.js 18 Alpine con pnpm
2. **dependencies** - Instalación de dependencias
3. **builder** - Build de la aplicación con Vite
4. **development** - Servidor de desarrollo con hot-reload
5. **production** - Nginx con assets optimizados

## 🚀 Uso

### Desarrollo

```bash
# Build para desarrollo
docker build --target development -t ecommerce-frontend:dev .

# Run en desarrollo (con hot-reload)
docker run -p 3000:3000 \
  -v $(pwd)/src:/app/src \
  -v $(pwd)/index.html:/app/index.html \
  -e VITE_API_URL=http://localhost:8000 \
  ecommerce-frontend:dev
```

O usando docker-compose:

```bash
# Iniciar servicio de desarrollo
docker-compose up frontend-dev

# Con logs
docker-compose up -d frontend-dev && docker-compose logs -f frontend-dev
```

### Producción

```bash
# Build para producción
docker build --target production -t ecommerce-frontend:prod .

# Run en producción
docker run -d \
  -p 80:80 \
  --name ecommerce-frontend \
  --restart unless-stopped \
  ecommerce-frontend:prod
```

O usando docker-compose:

```bash
# Iniciar servicio de producción
docker-compose up -d frontend-prod

# Ver logs
docker-compose logs -f frontend-prod
```

## 🔧 Características

### Seguridad

- ✅ **Security Headers**: CSP, X-Frame-Options, X-Content-Type-Options, etc.
- ✅ **Usuario no-root**: nginx ejecuta como usuario `appuser`
- ✅ **Rate Limiting**: Protección contra DDoS
- ✅ **HTTPS Ready**: Configuración lista para SSL/TLS

### Optimizaciones

- ✅ **Multi-stage build**: Imagen final ~50MB (solo nginx)
- ✅ **Gzip compression**: Reducción de tamaño de assets
- ✅ **Asset caching**: Caché agresivo para assets estáticos
- ✅ **SPA routing**: Soporte para React Router
- ✅ **API Proxy**: Opción de proxy para API (opcional)

### Performance

- ✅ **Static assets**: Cache de 1 año
- ✅ **HTML files**: Sin caché para actualizaciones
- ✅ **Compression**: Gzip con nivel 6
- ✅ **Logging optimizado**: Logs mínimos para assets

## 📝 Configuración Nginx

### Security Headers Incluidos

- `X-Frame-Options`: SAMEORIGIN
- `X-Content-Type-Options`: nosniff
- `X-XSS-Protection`: 1; mode=block
- `Referrer-Policy`: strict-origin-when-cross-origin
- `Content-Security-Policy`: Configurado (ajustable)
- `Permissions-Policy`: Restricciones de geolocalización, micrófono, cámara

### Rate Limiting

- API: 10 requests/segundo con burst de 20
- General: 30 requests/segundo con burst de 50

### Caching

- **Assets estáticos**: 1 año de caché
- **HTML**: Sin caché
- **Headers**: Cache-Control apropiados

## 🔍 Variables de Entorno

### Desarrollo

```bash
NODE_ENV=development
VITE_API_URL=http://localhost:8000
```

### Producción

```bash
NODE_ENV=production
```

## 🧪 Testing

### Verificar build

```bash
# Build y verificar
docker build --target production -t ecommerce-frontend:prod .
docker run -d -p 8080:80 ecommerce-frontend:prod

# Verificar en navegador
open http://localhost:8080
```

### Verificar security headers

```bash
# Con curl
curl -I http://localhost:80

# O usar herramientas online
# https://securityheaders.com
```

## 📊 Tamaño de Imagen

- **Development**: ~800MB (con Node.js y dependencias)
- **Production**: ~50MB (solo nginx con assets)

## 🔍 Troubleshooting

### Ver logs del contenedor

```bash
# Logs en tiempo real
docker-compose logs -f frontend-prod

# Logs de nginx
docker-compose exec frontend-prod cat /var/log/nginx/error.log
```

### Verificar configuración nginx

```bash
# Test configuración
docker-compose exec frontend-prod nginx -t

# Ver configuración
docker-compose exec frontend-prod cat /etc/nginx/conf.d/default.conf
```

### Rebuild completo

```bash
# Sin cache
docker-compose build --no-cache frontend-prod

# Rebuild y restart
docker-compose up -d --build frontend-prod
```

### Verificar health check

```bash
# Health check manual
docker inspect --format='{{.State.Health.Status}}' ecommerce-frontend-prod

# Ver detalles
docker inspect ecommerce-frontend-prod | grep -A 10 Health
```

## 🔐 Content Security Policy (CSP)

El CSP está configurado de forma básica. **Ajusta según tus necesidades**:

```nginx
Content-Security-Policy "default-src 'self'; 
  script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
  style-src 'self' 'unsafe-inline'; 
  img-src 'self' data: https:; 
  font-src 'self' data:; 
  connect-src 'self' http://localhost:8000 https://api.example.com;"
```

**Atención**: `unsafe-inline` y `unsafe-eval` pueden necesitarse para Vite/React, pero son menos seguros. Considera usar nonces en producción.

## 🚨 Seguridad en Producción

### Checklist

- [ ] Revisar y ajustar CSP según necesidades
- [ ] Habilitar HTTPS y configurar HSTS
- [ ] Actualizar rate limits según tráfico esperado
- [ ] Configurar logs centralizados
- [ ] Revisar permisos de archivos
- [ ] Actualizar dependencias regularmente
- [ ] Configurar monitoreo y alertas

## 📚 Recursos Adicionales

- [Nginx Best Practices](https://www.nginx.com/resources/wiki/start/topics/examples/full/)
- [Security Headers](https://owasp.org/www-project-secure-headers/)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
- [React Router Deployment](https://reactrouter.com/en/main/start/overview)

