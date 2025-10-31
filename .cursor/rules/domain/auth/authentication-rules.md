### Rules de Dominio Específico

**Archivo: `.cursor/rules/domain/auth/authentication-rules.md`**

```markdown
# Rules de Autenticación - E-commerce Project

## Contexto de Activación
**TRIGGER:** `**/auth/**` OR contains "login" OR contains "register" OR contains "authenticate"

## Patrones de Implementación Obligatorios

### 1. JWT Token Management

```typescript
// ✅ CORRECTO: Estructura de tokens estándar
interface AuthTokens {
  accessToken: string;      // 15 minutos expiración
  refreshToken: string;     // 7 días expiración
  tokenType: 'Bearer';
  expiresAt: number;        // Unix timestamp
}

// ✅ CORRECTO: Auto-refresh implementación
const useAuthTokens = () => {
  const [tokens, setTokens] = useState<AuthTokens | null>(null);

  const refreshAccessToken = useCallback(async () => {
    if (!tokens?.refreshToken) throw new Error('No refresh token available');

    try {
      const response = await authAPI.refreshToken(tokens.refreshToken);
      const newTokens = {
        ...response.data,
        expiresAt: Date.now() + (response.data.expiresIn * 1000)
      };

      setTokens(newTokens);
      localStorage.setItem('auth_tokens', JSON.stringify(newTokens));

      return newTokens.accessToken;
    } catch (error) {
      // Auto logout si refresh falla
      setTokens(null);
      localStorage.removeItem('auth_tokens');
      throw error;
    }
  }, [tokens?.refreshToken]);

  return { tokens, refreshAccessToken };
};

// ✅ CORRECTO: Protected route wrapper
interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: UserRole[];
  fallbackPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRoles = [],
  fallbackPath = '/login'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      navigate(fallbackPath, { replace: true });
      return;
    }

    if (requiredRoles.length > 0 && !hasRequiredRoles(user, requiredRoles)) {
      navigate('/unauthorized', { replace: true });
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredRoles, navigate, fallbackPath]);

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return null;
  if (requiredRoles.length > 0 && !hasRequiredRoles(user, requiredRoles)) {
    return null;
  }

  return <>{children}</>;
};