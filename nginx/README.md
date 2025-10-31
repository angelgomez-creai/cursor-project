# Nginx Configuration - E-commerce

## 📋 Estructura

```
nginx/
├── nginx.conf          # Main nginx configuration
├── conf.d/
│   └── default.conf    # Server configuration
└── ssl/                # SSL certificates (create this directory)
    ├── cert.pem
    └── key.pem
```

## 🔧 Configuración

### HTTP (Puerto 80)

Ya configurado por defecto. Funciona sin configuración adicional.

### HTTPS (Puerto 443)

1. Crear directorio `nginx/ssl/`
2. Colocar certificados SSL:
   - `cert.pem` - Certificado
   - `key.pem` - Clave privada
3. Descomentar sección HTTPS en `nginx/conf.d/default.conf`
4. Actualizar `DOMAIN` en `.env`

## 🔐 Security Headers

Incluidos automáticamente:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy
- Strict-Transport-Security (HTTPS)

## 🚦 Rate Limiting

- **API**: 10 req/s, burst 20
- **Auth**: 5 req/s, burst 10
- **General**: 30 req/s, burst 50

Ajustar en `nginx/conf.d/default.conf`.

## 📊 Logs

Los logs están en volúmenes Docker:
- Access logs: `nginx_logs`
- Cache: `nginx_cache`

Para ver logs:
```bash
docker-compose logs nginx
```

## 🔄 Reload Configuration

```bash
# Test configuration
docker-compose exec nginx nginx -t

# Reload without downtime
docker-compose exec nginx nginx -s reload
```

