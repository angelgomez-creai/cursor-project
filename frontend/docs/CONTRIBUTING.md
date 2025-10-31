# Contributing to Frontend Documentation

## 📋 Guía de Contribución

Esta guía explica cómo contribuir a la documentación del frontend y mantenerla actualizada.

## ✍️ Agregar JSDoc

### Estructura Básica

```typescript
/**
 * Brief description (one line)
 * 
 * Detailed description if needed
 * 
 * @param {Type} param - Parameter description
 * @returns {ReturnType} Return description
 * 
 * @example
 * ```typescript
 * const result = myFunction('example')
 * ```
 * 
 * @throws {Error} When something fails
 * 
 * @edgeCases
 * - **Case 1**: Description
 * - **Case 2**: Description
 * 
 * @see {@link RelatedFunction} Related functions
 * @todo Future improvements
 */
```

### Componentes React

```typescript
/**
 * Component description
 * 
 * @component
 * @description Detailed description
 * 
 * @param {PropsType} props - Component props
 * @param {Type} props.propName - Prop description
 * 
 * @example
 * ```tsx
 * <MyComponent prop="value" />
 * ```
 */
```

### Hooks

```typescript
/**
 * Hook description
 * 
 * @param {Type} param - Parameter
 * @returns {ReturnType} Return description
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
 * @namespace serviceName
 * 
 * @example
 * ```typescript
 * const result = await serviceName.method()
 * ```
 */
```

## 📝 Ejemplos de Uso

### Incluir en JSDoc

```typescript
/**
 * @example
 * ```typescript
 * // Basic usage
 * const result = myFunction('input')
 * 
 * // Advanced usage
 * const result = myFunction('input', { option: true })
 * ```
 */
```

Los ejemplos se extraen automáticamente y se incluyen en la documentación.

## ⚠️ Edge Cases

Documentar edge cases en el JSDoc:

```typescript
/**
 * @edgeCases
 * - **Sin datos**: Retorna array vacío
 * - **Network error**: Propaga ApiError
 * - **Invalid input**: Lanza Error
 */
```

O agregar a `docs/EDGE_CASES.md`:

```markdown
### MyFunction

**Edge Cases**:
- **Input vacío**: Retorna defaultValue
- **Network timeout**: Retry 3 veces
```

## 🔗 Integraciones

Agregar nuevas integraciones a `docs/INTEGRATIONS.md`:

```markdown
### New Service

**Service**: `@shared/services/newService`

**Descripción**: Description

**Configuración**:
```typescript
// Example
```

**Edge Cases**:
- Case 1
- Case 2
```

## 🔄 Workflow de Actualización

### Local Development

1. **Editar código** con JSDoc
2. **Ver docs localmente**: `pnpm run docs:serve`
3. **Validar**: `pnpm run docs:validate`

### Antes de Commit

1. **Generar docs**: `pnpm run docs:build`
2. **Validar**: `pnpm run docs:validate`
3. **Commit cambios** (docs auto-generadas)

### Watch Mode

```bash
# Auto-regenerar en cambios
pnpm run docs:watch
```

## ✅ Checklist

Antes de hacer PR, asegurarse de:

- [ ] JSDoc agregado a nuevos exports públicos
- [ ] Ejemplos incluidos en JSDoc
- [ ] Edge cases documentados
- [ ] Integraciones actualizadas (si aplica)
- [ ] `pnpm run docs:validate` pasa sin errores
- [ ] Documentación generada (`pnpm run docs:build`)

## 📚 Recursos

- [JSDoc Tags](https://jsdoc.app/index.html)
- [TypeDoc Documentation](https://typedoc.org/guides/doccomments/)
- [Example Documentation](./USAGE_EXAMPLES.md)

