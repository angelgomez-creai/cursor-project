// Estrategias de uso por escenario
const fileSelectionStrategies = {
  // Desarrollo de componente
  component_development: [
    "@Files: src/components/ui/",      // Componentes base
    "@Files: src/hooks/",              // Custom hooks
    "@Files: src/types/",              // Definiciones de tipos
  ],

  // Debugging específico
  bug_debugging: [
    "@Files: src/pages/problem-page.tsx",  // Archivo con bug
    "@Files: src/hooks/useDataFetch.ts",   // Hook relacionado
    "@Files: src/api/service.ts"           // Servicio de datos
  ]
};

Create a payment component following our design system.

@Files: src/components/ui/Button.tsx, src/components/ui/Input.tsx
@Docs: ./docs/design-system.md, ./docs/payment-guidelines.md
@Web: Stripe Elements React documentation

**Requirements:**
- Follow design system patterns
- Include proper validation
- Handle loading/error states