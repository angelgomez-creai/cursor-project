"""
Ejemplos de uso del servicio JWT
"""
from infrastructure.auth.auth_service import get_auth_service
from infrastructure.auth.jwt_service import JWTService
from infrastructure.auth.password_service import PasswordService


def example_create_and_verify_token():
    """Ejemplo: Crear y verificar un token JWT"""
    print("=" * 50)
    print("Ejemplo 1: Crear y verificar token JWT")
    print("=" * 50)
    
    auth_service = get_auth_service()
    
    # Crear payload
    payload = {
        "user_id": 1,
        "email": "user@example.com",
        "role": "customer"
    }
    
    # Crear token
    token = auth_service.create_token(payload, expires_in_minutes=60)
    print(f"\n✅ Token creado: {token[:50]}...")
    
    # Verificar token
    try:
        decoded = auth_service.verify_token(token)
        print(f"\n✅ Token verificado correctamente:")
        print(f"   User ID: {decoded.get('user_id')}")
        print(f"   Email: {decoded.get('email')}")
        print(f"   Role: {decoded.get('role')}")
    except Exception as e:
        print(f"\n❌ Error al verificar token: {e}")


def example_password_hashing():
    """Ejemplo: Hash y verificación de contraseñas"""
    print("\n" + "=" * 50)
    print("Ejemplo 2: Hash y verificación de contraseñas")
    print("=" * 50)
    
    auth_service = get_auth_service()
    
    # Contraseña original
    password = "mySecurePassword123"
    print(f"\n🔑 Contraseña original: {password}")
    
    # Hash de contraseña
    hashed = auth_service.hash_password(password)
    print(f"\n✅ Hash generado: {hashed[:50]}...")
    
    # Verificar contraseña correcta
    is_valid = auth_service.verify_password(password, hashed)
    print(f"\n✅ Verificación con contraseña correcta: {is_valid}")
    
    # Verificar contraseña incorrecta
    is_valid_wrong = auth_service.verify_password("wrongPassword", hashed)
    print(f"❌ Verificación con contraseña incorrecta: {is_valid_wrong}")


def example_token_expiration():
    """Ejemplo: Manejo de tokens expirados"""
    print("\n" + "=" * 50)
    print("Ejemplo 3: Manejo de tokens expirados")
    print("=" * 50)
    
    auth_service = get_auth_service()
    
    # Crear token que expira inmediatamente (en -1 minutos)
    payload = {"user_id": 1}
    token = auth_service.create_token(payload, expires_in_minutes=-1)
    
    print(f"\n⏰ Token creado con expiración inmediata")
    
    # Intentar verificar (debería fallar)
    try:
        decoded = auth_service.verify_token(token)
        print(f"❌ Token no debería ser válido")
    except Exception as e:
        print(f"✅ Token correctamente rechazado (expirado): {e}")


def example_full_authentication_flow():
    """Ejemplo: Flujo completo de autenticación"""
    print("\n" + "=" * 50)
    print("Ejemplo 4: Flujo completo de autenticación")
    print("=" * 50)
    
    auth_service = get_auth_service()
    
    # 1. Usuario registra cuenta (hash password)
    password = "userPassword123"
    hashed_password = auth_service.hash_password(password)
    print(f"\n1️⃣ Usuario registrado con hash: {hashed_password[:30]}...")
    
    # 2. Usuario intenta login (verificar password)
    login_password = "userPassword123"
    is_valid = auth_service.verify_password(login_password, hashed_password)
    
    if is_valid:
        print(f"✅ Login exitoso - contraseña correcta")
        
        # 3. Generar token JWT
        payload = {
            "user_id": 1,
            "email": "user@example.com"
        }
        token = auth_service.create_token(payload)
        print(f"✅ Token JWT generado: {token[:50]}...")
        
        # 4. Usar token en requests protegidas
        decoded = auth_service.verify_token(token)
        print(f"✅ Token verificado en request protegida")
        print(f"   Usuario autenticado: {decoded.get('email')}")
    else:
        print(f"❌ Login fallido - contraseña incorrecta")


if __name__ == "__main__":
    print("\n🚀 Ejemplos de Uso del Servicio JWT")
    print("=" * 50)
    
    # Ejecutar ejemplos
    example_create_and_verify_token()
    example_password_hashing()
    example_token_expiration()
    example_full_authentication_flow()
    
    print("\n" + "=" * 50)
    print("✅ Ejemplos completados")
    print("=" * 50)

