# Frontend Documentation

## 📚 Descripción

Documentación completa y actualizada del frontend del e-commerce, generada automáticamente desde el código fuente con TypeDoc y JSDoc.

## 📖 Estructura

```
docs/
├── README.md              # Este archivo
├── INTEGRATIONS.md        # Integraciones con servicios externos
├── EDGE_CASES.md          # Edge cases y manejo de errores
├── examples/              # Ejemplos de uso extraídos del código
└── [TypeDoc generated]     # Documentación API generada por TypeDoc
```

## 🚀 Inicio Rápido

### Ver Documentación Localmente

```bash
# Generar documentación
pnpm run docs

# Ver documentación (HTML)
pnpm run docs:serve
# Abre http://localhost:3001
```

### Watch Mode (Desarrollo)

```bash
# Auto-regenerar docs cuando código cambie
pnpm run docs:watch
```

## 📋 Comandos Disponibles

```bash
# Generar documentación
pnpm run docs

# Watch mode (auto-regenerate)
pnpm run docs:watch

# Servir documentación HTML
pnpm run docs:serve

# Build completo (docs + ejemplos)
pnpm run docs:build

# Generar ejemplos de uso
pnpm run docs:generate-examples

# Validar documentación
pnpm run docs:validate
```

## 📝 Documentación Incluida

### API Reference

Documentación automática de:
- **Componentes React**: Props, ejemplos, edge cases
- **Hooks**: Parámetros, valores de retorno, ejemplos
- **Servicios**: Métodos, parámetros, manejo de errores
- **Utils**: Funciones de utilidad con ejemplos
- **Types**: Definiciones de tipos TypeScript

### Ejemplos de Uso

Extraídos automáticamente de bloques `@example` en JSDoc:

```typescript
/**
 * @example
 * ```typescript
 * const [token, setToken] = useLocalStorage('auth_token', null)
 * ```
 */
```

### Edge Cases

Documentados en `EDGE_CASES.md`:
- Manejo de errores
- Validaciones
- Casos límite
- Mejoras sugeridas

### Integraciones

Documentadas en `INTEGRATIONS.md`:
- Backend API
- React Router
- Ant Design
- Axios
- LocalStorage
- Y más...

## 🔄 Auto-Update

La documentación se actualiza automáticamente:

1. **GitHub Actions**: En cada push a `main` o `develop`
2. **Local Watch**: Con `pnpm run docs:watch`
3. **Pre-commit Hook**: Opcional (configurar en `.husky`)

## 📚 Cómo Contribuir

### Agregar JSDoc a Nuevo Código

```typescript
/**
 * Description of the function/component
 * 
 * @param {Type} param - Parameter description
 * @returns {ReturnType} Return description
 * 
 * @example
 * ```typescript
 * const result = myFunction('example')
 * ```
 * 
 * @throws {Error} When something goes wrong
 * 
 * @edgeCases
 * - Case 1: Description
 * - Case 2: Description
 */
```

### Documentar Edge Cases

Agregar a `docs/EDGE_CASES.md` o en el JSDoc del componente:

```typescript
/**
 * @edgeCases
 * - **Sin datos**: Retorna array vacío
 * - **Network error**: Propaga ApiError
 */
```

### Documentar Integraciones

Agregar a `docs/INTEGRATIONS.md` con:
- Descripción del servicio
- Configuración
- Ejemplos de uso
- Edge cases específicos

## 🎯 Buenas Prácticas

1. **Siempre documentar exports públicos**: Funciones, componentes, hooks
2. **Incluir ejemplos**: Al menos un ejemplo por función pública
3. **Documentar edge cases**: Especialmente validaciones y errores
4. **Mantener actualizado**: Actualizar docs cuando cambia el código
5. **Validar regularmente**: Ejecutar `pnpm run docs:validate`

## 📖 Recursos

- [TypeDoc Documentation](https://typedoc.org/)
- [JSDoc Reference](https://jsdoc.app/)
- [Documentation Best Practices](https://jsdoc.app/about-getting-started.html)

## 🔍 Navegación

- **API Reference**: Ver archivos generados por TypeDoc
- **Examples**: Ver `docs/examples/index.md`
- **Edge Cases**: Ver `docs/EDGE_CASES.md`
- **Integrations**: Ver `docs/INTEGRATIONS.md`

