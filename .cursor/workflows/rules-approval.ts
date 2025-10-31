interface RulesChangeWorkflow {
    // Pre-commit validation
    validateRulesChange: (changes: RulesChange[]) => ValidationResult;
  
    // Peer review process
    requestPeerReview: (changes: RulesChange[], reviewers: string[]) => void;
  
    // Impact analysis
    analyzeImpact: (changes: RulesChange[]) => ImpactAnalysis;
  
    // Auto-migration where possible
    generateMigrations: (changes: RulesChange[]) => Migration[];
  }
  
  // Ejemplo de validación automática
  const validateRulesChange = (changes: RulesChange[]): ValidationResult => {
    const results: ValidationResult[] = [];
  
    for (const change of changes) {
      // Validar sintaxis
      if (!isValidMarkdown(change.content)) {
        results.push({
          type: 'error',
          message: `Invalid markdown syntax in ${change.file}`,
          severity: 'high'
        });
      }
  
      // Validar consistencia con reglas existentes
      const conflicts = findRuleConflicts(change, existingRules);
      if (conflicts.length > 0) {
        results.push({
          type: 'warning',
          message: `Rule conflicts detected: ${conflicts.join(', ')}`,
          severity: 'medium'
        });
      }
  
      // Validar ejemplos de código
      const codeExamples = extractCodeExamples(change.content);
      for (const example of codeExamples) {
        if (!validateCodeExample(example)) {
          results.push({
            type: 'error',
            message: `Invalid code example in ${change.file}`,
            severity: 'high'
          });
        }
      }
    }
  
    return {
      valid: results.every(r => r.type !== 'error'),
      issues: results
    };
  };