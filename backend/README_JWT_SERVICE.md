# JWT Authentication Service

## 📋 Descripción

Servicio completo de autenticación JWT implementado con Clean Architecture usando PyJWT y bcrypt.

## 🏗️ Estructura

```
backend/src/
├── domain/
│   └── interfaces/
│       └── auth_service.py          # Interface para servicios de autenticación
│
├── infrastructure/
│   └── auth/
│       ├── jwt_service.py            # Implementación JWT con PyJWT
│       ├── password_service.py        # Implementación password hashing con bcrypt
│       └── auth_service.py            # Servicio combinado de autenticación
│
└── presentation/
    ├── middleware/
    │   └── auth_middleware.py        # Middleware para proteger rutas
    └── api/v1/auth/
        └── router.py                  # Endpoints de autenticación
```

## 🔧 Funcionalidades

### 1. JWT Service (`jwt_service.py`)

- ✅ `create_token(payload, expires_in_minutes)` - Crear token JWT
- ✅ `verify_token(token)` - Verificar y decodificar token

**Características:**
- Usa PyJWT para manejo seguro de tokens
- Soporta expiración configurable
- Incluye claims estándar (exp, iat, nbf)
- Manejo de errores robusto

### 2. Password Service (`password_service.py`)

- ✅ `hash_password(password)` - Hash de contraseña con bcrypt
- ✅ `verify_password(plain_password, hashed_password)` - Verificar contraseña
- ✅ `is_password_hashed(password_hash)` - Detectar si es un hash

**Características:**
- Usa bcrypt con 12 rounds (balance seguridad/performance)
- Salt automático por cada hash
- Comparación constante en tiempo (previene timing attacks)

### 3. Auth Service (`auth_service.py`)

Servicio combinado que expone ambas funcionalidades:
- `create_token()`
- `verify_token()`
- `hash_password()`
- `verify_password()`

## 📝 Uso

### Configuración

Asegúrate de configurar `JWT_SECRET_KEY` en variables de entorno:

```bash
# .env
JWT_SECRET_KEY=tu-clave-secreta-super-segura-aqui
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

**⚠️ IMPORTANTE:** En producción, usa una clave secreta fuerte y aleatoria.

### Ejemplos de Uso

#### 1. Crear Token

```python
from infrastructure.auth.auth_service import get_auth_service

auth_service = get_auth_service()

# Crear token
payload = {
    "user_id": 1,
    "email": "user@example.com",
    "role": "customer"
}
token = auth_service.create_token(payload, expires_in_minutes=60)

print(f"Token: {token}")
```

#### 2. Verificar Token

```python
# Verificar token
try:
    payload = auth_service.verify_token(token)
    print(f"User ID: {payload['user_id']}")
    print(f"Email: {payload['email']}")
except Exception as e:
    print(f"Token inválido: {e}")
```

#### 3. Hash Password

```python
# Hash de contraseña
password = "mySecurePassword123"
hashed = auth_service.hash_password(password)
print(f"Hashed: {hashed}")

# Guardar hashed en base de datos
```

#### 4. Verificar Password

```python
# Verificar contraseña
plain_password = "mySecurePassword123"
is_valid = auth_service.verify_password(plain_password, hashed)

if is_valid:
    print("Contraseña correcta")
else:
    print("Contraseña incorrecta")
```

#### 5. Proteger Rutas FastAPI

```python
from fastapi import APIRouter, Depends
from presentation.middleware.auth_middleware import get_current_user

router = APIRouter()

@router.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    """
    Ruta protegida - requiere token JWT válido
    """
    return {
        "message": "Esta ruta está protegida",
        "user": current_user
    }
```

## 🔐 Endpoints API

### POST `/api/v1/auth/login`

Login y obtención de token.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 30
}
```

### POST `/api/v1/auth/verify`

Verificar token.

**Request:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "valid": true,
  "payload": {
    "user_id": 1,
    "email": "user@example.com"
  }
}
```

### GET `/api/v1/auth/me`

Obtener información del usuario actual (requiere token).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "user_id": 1,
    "email": "user@example.com"
  },
  "authenticated": true
}
```

## 🧪 Testing

Ejecutar tests:

```bash
# Instalar pytest si no está instalado
pip install pytest

# Ejecutar tests
pytest tests/test_jwt_service.py -v
```

## ⚠️ Seguridad

### Buenas Prácticas

1. **Secret Key**: Usa una clave secreta fuerte y única en producción
2. **HTTPS**: Siempre usa HTTPS en producción
3. **Token Expiration**: Configura tiempos de expiración apropiados
4. **Password Strength**: Implementa validación de fortaleza de contraseña
5. **Rate Limiting**: Implementa rate limiting en endpoints de login
6. **Logging**: Registra intentos de login fallidos

### NO Hacer

- ❌ No almacenes secretos en código
- ❌ No envíes tokens en URLs
- ❌ No uses tokens expirados
- ❌ No almacenes contraseñas en texto plano
- ❌ No uses la misma clave secreta en todos los entornos

## 📚 Dependencias

- `PyJWT==2.8.0` - Manejo de tokens JWT
- `bcrypt==4.1.2` - Hash de contraseñas
- `passlib[bcrypt]==1.7.4` - Utilidades adicionales (opcional)

## 🔄 Integración con User System

Para integrar con un sistema de usuarios:

1. Crear entidad `User` en domain layer
2. Crear `UserRepository` interface
3. Implementar `UserRepository` en infrastructure
4. Actualizar endpoint `/login` para verificar contra base de datos
5. Usar `hash_password` al crear usuarios
6. Usar `verify_password` al autenticar

Ejemplo futuro:

```python
@router.post("/login")
async def login(credentials: LoginRequest):
    # Verificar usuario en base de datos
    user = await user_repository.get_by_email(credentials.email)
    if not user:
        raise HTTPException(401, "Invalid credentials")
    
    # Verificar contraseña
    auth_service = get_auth_service()
    if not auth_service.verify_password(credentials.password, user.hashed_password):
        raise HTTPException(401, "Invalid credentials")
    
    # Crear token
    payload = {"user_id": user.id, "email": user.email}
    token = auth_service.create_token(payload)
    
    return TokenResponse(access_token=token, ...)
```

