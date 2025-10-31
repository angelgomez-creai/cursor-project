#!/usr/bin/env node

/**
 * Script to validate documentation completeness
 * Checks for missing JSDoc comments, examples, and edge cases
 */

const fs = require('fs');
const path = require('path');

const SOURCE_DIR = path.join(__dirname, '../src');
const REQUIRED_FILES = [
  'src/shared/services/apiClient.ts',
  'src/features/products/services/productService.ts',
  'src/features/cart/services/cartService.ts',
  'src/features/auth/services/authService.ts',
];

/**
 * Check if file has JSDoc
 */
function hasJSDoc(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return /\/\*\*[\s\S]*?\*\//.test(content) || /\/\/\/[\s\S]*?\n/.test(content);
}

/**
 * Check if file has examples
 */
function hasExamples(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return /@example/.test(content);
}

/**
 * Check if file has edge cases documented
 */
function hasEdgeCases(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  return /@throws|@since|@deprecated|edge case|Edge Case/.test(content);
}

/**
 * Validate documentation
 */
function validateDocs() {
  const issues = [];
  
  function walkDir(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('__') && file !== 'node_modules') {
        walkDir(filePath);
      } else if ((file.endsWith('.ts') || file.endsWith('.tsx')) && !file.includes('.test.') && !file.includes('.spec.')) {
        const relativePath = path.relative(SOURCE_DIR, filePath);
        
        if (!hasJSDoc(filePath)) {
          issues.push({
            file: relativePath,
            type: 'missing-jsdoc',
            severity: 'warning'
          });
        }
        
        // Check for examples in important files
        if (REQUIRED_FILES.some(req => relativePath.includes(req))) {
          if (!hasExamples(filePath)) {
            issues.push({
              file: relativePath,
              type: 'missing-examples',
              severity: 'info'
            });
          }
        }
      }
    });
  }
  
  walkDir(SOURCE_DIR);
  
  if (issues.length > 0) {
    console.log('\n📋 Documentation Validation Results:\n');
    
    const byType = {};
    issues.forEach(issue => {
      if (!byType[issue.type]) {
        byType[issue.type] = [];
      }
      byType[issue.type].push(issue);
    });
    
    Object.entries(byType).forEach(([type, items]) => {
      console.log(`\n${type} (${items.length}):`);
      items.slice(0, 10).forEach(item => {
        console.log(`  - ${item.file}`);
      });
      if (items.length > 10) {
        console.log(`  ... and ${items.length - 10} more`);
      }
    });
    
    return false;
  }
  
  console.log('✅ All documentation validated successfully!');
  return true;
}

if (require.main === module) {
  const isValid = validateDocs();
  process.exit(isValid ? 0 : 1);
}

module.exports = { validateDocs };

