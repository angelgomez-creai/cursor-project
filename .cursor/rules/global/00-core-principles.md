# Principios Core Inmutables del Proyecto

## Principios Arquitectónicos Fundamentales

### 1. Separation of Concerns
- **Domain Logic**: Separado de infrastructure concerns
- **UI Components**: Puros, sin lógica de negocio
- **Data Access**: Abstraído detrás de interfaces
- **Cross-cutting Concerns**: Manejados por middleware/interceptors

### 2. Type Safety First
- **TypeScript Strict Mode**: Habilitado en toda la codebase
- **End-to-End Type Safety**: Desde DB hasta UI
- **No `any` types**: Excepto en casos específicamente documentados
- **Interface Segregation**: Interfaces pequeñas y específicas

### 3. Performance by Design
- **Lazy Loading**: Implementado por defecto en rutas y componentes
- **Memoization**: Aplicada estratégicamente con React.memo, useMemo, useCallback
- **Bundle Optimization**: Code splitting y tree shaking activos
- **Database Optimization**: Queries optimizadas con índices apropiados

### 4. Security by Default
- **Input Validation**: Toda entrada validada con schemas (Zod)
- **Authentication**: JWT con refresh tokens, expiración corta
- **Authorization**: RBAC implementado consistentemente
- **Data Sanitization**: Automática en todos los endpoints

## Patrones de Implementación Obligatorios

### Error Handling Unificado

```typescript
// ✅ CORRECTO: Pattern establecido para manejo de errores
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    pagination?: PaginationInfo;
    timestamp: string;
  };
}

// ✅ CORRECTO: Custom hook para API calls
const useApiCall = <T>(endpoint: string) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const execute = useCallback(async (params?: any) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await apiClient.call<T>(endpoint, params);
      if (response.success) {
        setState({ data: response.data!, loading: false, error: null });
      } else {
        setState({
          data: null,
          loading: false,
          error: response.error!
        });
      }
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: {
          code: 'NETWORK_ERROR',
          message: 'Error de conexión'
        }
      });
    }
  }, [endpoint]);

  return { ...state, execute };
};

// ✅ CORRECTO: Template de componente estándar
interface ComponentProps {
  // Props obligatorias primero
  title: string;

  // Props opcionales después, con valores por defecto documentados
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;

  // Props de función al final
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

  // Props de composición
  children?: ReactNode;
  className?: string;
}

const Component: React.FC<ComponentProps> = ({
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
  className
}) => {
  // 1. Hooks de estado
  const [isLoading, setIsLoading] = useState(false);

  // 2. Hooks de contexto/selectors
  const user = useAuthStore(state => state.user);

  // 3. Computaciones derivadas con useMemo
  const computedClassName = useMemo(() => cn(
    'base-classes',
    `variant-${variant}`,
    `size-${size}`,
    { 'opacity-50 cursor-not-allowed': disabled },
    className
  ), [variant, size, disabled, className]);

  // 4. Event handlers con useCallback
  const handleClick = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    setIsLoading(true);
    onClick?.(event);

    // Cleanup loading state after operation
    setTimeout(() => setIsLoading(false), 100);
  }, [disabled, isLoading, onClick]);

  // 5. Early returns para edge cases
  if (!title) return null;

  // 6. Render principal
  return (
    <button
      className={computedClassName}
      onClick={handleClick}
      disabled={disabled || isLoading}
      aria-label={title}
    >
      {isLoading ? <LoadingSpinner size="sm" /> : title}
      {children}
    </button>
  );
};

export default Component;