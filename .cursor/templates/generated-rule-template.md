# Mejores Prácticas de Implementación - Generated Rule

*Generated from successful conversation patterns on project development*

## Context
Esta regla se aplica en el contexto del desarrollo del proyecto e-commerce, donde se requiere consistencia en patrones de implementación, manejo de errores, logging estructurado y seguimiento de mejores prácticas arquitecturales. Es especialmente relevante para funciones que manejan datos críticos del negocio.

## Problem Solved
Esta regla soluciona patrones inconsistentes de implementación que pueden llevar a bugs, code smells o violaciones de las mejores prácticas del proyecto. Se activa cuando se detectan patrones específicos que requieren refactoring o mejora según los estándares establecidos.

## Trigger Conditions
**ACTIVATION:** Cuando se detectan patrones específicos que requieren implementación de mejores prácticas del proyecto.

## Solution Pattern

### ✅ RECOMMENDED APPROACH
```javascript
// Ejemplo de implementación recomendada siguiendo las reglas del proyecto
const recommendedImplementation = async (data) => {
  // Validación de entrada
  const validatedData = await validateInputData(data);

  // Lógica de negocio con manejo de errores
  try {
    const result = await processBusinessLogic(validatedData);

    // Logging estructurado
    logger.info('Operation completed successfully', {
      operationType: 'data-processing',
      dataSize: validatedData.length,
      processingTime: Date.now()
    });

    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    logger.error('Operation failed', {
      error: error.message,
      stack: error.stack,
      input: validatedData
    });

    throw new ProcessingError(
      'Data processing failed',
      { cause: error, recoverable: true }
    );
  }
};