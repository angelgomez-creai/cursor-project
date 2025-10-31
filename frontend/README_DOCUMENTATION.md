# Frontend Documentation System

## 📚 Descripción

Sistema completo de documentación automática para el frontend del e-commerce, generado desde el código fuente con TypeDoc y JSDoc.

## 🚀 Inicio Rápido

### Generar Documentación

```bash
cd frontend

# Instalar dependencias (si no están instaladas)
pnpm install

# Generar documentación
pnpm run docs

# Ver documentación HTML
pnpm run docs:serve
# Abre http://localhost:3001
```

### Watch Mode (Desarrollo)

```bash
# Auto-regenerar docs cuando código cambie
pnpm run docs:watch
```

## 📋 Comandos Disponibles

| Comando | Descripción |
|---------|-------------|
| `pnpm run docs` | Genera documentación TypeDoc |
| `pnpm run docs:watch` | Watch mode (auto-regenerate) |
| `pnpm run docs:serve` | Sirve docs en http://localhost:3001 |
| `pnpm run docs:build` | Build completo (docs + ejemplos) |
| `pnpm run docs:generate-examples` | Extrae ejemplos de código |
| `pnpm run docs:validate` | Valida completitud de docs |

## 📁 Estructura de Documentación

```
frontend/
├── docs/                      # Documentación generada
│   ├── README.md             # Índice de documentación
│   ├── INTEGRATIONS.md       # Integraciones con servicios
│   ├── EDGE_CASES.md         # Edge cases y errores
│   ├── USAGE_EXAMPLES.md     # Ejemplos de uso
│   ├── CONTRIBUTING.md       # Guía de contribución
│   ├── examples/             # Ejemplos extraídos
│   └── [TypeDoc generated]  # API reference HTML
├── scripts/
│   ├── generate-examples.js  # Extrae ejemplos del código
│   ├── validate-docs.js      # Valida completitud
│   └── watch-docs.js         # Watch mode script
├── typedoc.json              # Configuración TypeDoc
└── .github/workflows/
    └── docs-auto-update.yml  # Auto-update en CI/CD
```

## 🔄 Auto-Update

### Local (Watch Mode)

```bash
# Auto-regenera docs al cambiar código
pnpm run docs:watch
```

### GitHub Actions

La documentación se actualiza automáticamente:

1. **On Push**: Genera docs y commit si hay cambios
2. **On PR**: Crea PR con updates de docs
3. **On Main**: Despliega a GitHub Pages

Ver: `.github/workflows/docs-auto-update.yml`

### Pre-commit Hook (Opcional)

Si usas Husky, el hook pre-commit genera docs antes de cada commit.

## 📝 Cómo Documentar

### Componentes React

```typescript
/**
 * Component description
 * 
 * @component
 * @param {PropsType} props - Component props
 * 
 * @example
 * ```tsx
 * <MyComponent prop="value" />
 * ```
 * 
 * @edgeCases
 * - **Case 1**: Description
 */
```

### Hooks

```typescript
/**
 * Hook description
 * 
 * @param {Type} param - Parameter
 * @returns {ReturnType} Description
 * 
 * @example
 * ```typescript
 * const result = useMyHook(param)
 * ```
 */
```

### Servicios

```typescript
/**
 * Service description
 * 
 * @param {Type} param - Parameter
 * @returns {Promise<Type>} Description
 * 
 * @throws {Error} When something fails
 * 
 * @example
 * ```typescript
 * const result = await service.method(param)
 * ```
 */
```

## 📊 Validación

Validar documentación:

```bash
pnpm run docs:validate
```

Esto verifica:
- ✅ JSDoc presente en exports públicos
- ✅ Ejemplos incluidos (en archivos importantes)
- ✅ Edge cases documentados

## 📖 Documentación Generada

### API Reference (TypeDoc)

- **Componentes**: Props, ejemplos, edge cases
- **Hooks**: Parámetros, valores de retorno
- **Servicios**: Métodos, manejo de errores
- **Utils**: Funciones con ejemplos
- **Types**: Definiciones TypeScript

### Ejemplos de Uso

Extraídos automáticamente de bloques `@example`:
- Ver `docs/examples/index.md`
- Ver `docs/USAGE_EXAMPLES.md`

### Edge Cases

- Ver `docs/EDGE_CASES.md` para casos documentados
- Ver JSDoc de cada función para casos específicos

### Integraciones

- Ver `docs/INTEGRATIONS.md` para todas las integraciones

## 🎯 Buenas Prácticas

1. **Documentar exports públicos**: Funciones, componentes, hooks usados fuera del módulo
2. **Incluir ejemplos**: Al menos un ejemplo por función pública
3. **Documentar edge cases**: Especialmente validaciones y errores
4. **Mantener actualizado**: Actualizar docs cuando cambia código
5. **Validar regularmente**: Ejecutar `pnpm run docs:validate`

## 🔍 Navegación

- **API Reference**: Ver `docs/` (generado por TypeDoc)
- **Examples**: Ver `docs/USAGE_EXAMPLES.md`
- **Edge Cases**: Ver `docs/EDGE_CASES.md`
- **Integrations**: Ver `docs/INTEGRATIONS.md`
- **Contributing**: Ver `docs/CONTRIBUTING.md`

## 📚 Recursos

- [TypeDoc Documentation](https://typedoc.org/)
- [JSDoc Reference](https://jsdoc.app/)
- [Documentation Best Practices](./docs/CONTRIBUTING.md)

