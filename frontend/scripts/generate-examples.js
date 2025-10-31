#!/usr/bin/env node

/**
 * Script to generate usage examples for documentation
 * Extracts @example blocks from JSDoc comments and generates markdown files
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EXAMPLES_DIR = path.join(__dirname, '../docs/examples');
const SOURCE_DIR = path.join(__dirname, '../src');

/**
 * Extract examples from JSDoc comments in a file
 */
function extractExamples(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const examples = [];
  
  // Match @example blocks in JSDoc
  const exampleRegex = /@example\s+```(\w+)?\n([\s\S]*?)```/g;
  let match;
  
  while ((match = exampleRegex.exec(content)) !== null) {
    const language = match[1] || 'typescript';
    const code = match[2].trim();
    examples.push({ language, code, filePath });
  }
  
  return examples;
}

/**
 * Generate example files
 */
function generateExamples() {
  // Ensure examples directory exists
  if (!fs.existsSync(EXAMPLES_DIR)) {
    fs.mkdirSync(EXAMPLES_DIR, { recursive: true });
  }

  const allExamples = [];
  
  // Walk through source directory
  function walkDir(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory()) {
        walkDir(filePath, fileList);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        const examples = extractExamples(filePath);
        if (examples.length > 0) {
          allExamples.push({
            file: filePath.replace(SOURCE_DIR, ''),
            examples
          });
        }
      }
    });
    
    return fileList;
  }
  
  walkDir(SOURCE_DIR);
  
  // Generate index
  const indexContent = allExamples.map(item => {
    const relativePath = item.file.replace(/\\/g, '/').replace(/^\//, '');
    const moduleName = path.dirname(relativePath).replace(/\//g, '-') + '-' + path.basename(relativePath, path.extname(relativePath));
    
    return `## ${relativePath}\n\n${item.examples.map((ex, idx) => 
      `### Example ${idx + 1}\n\n\`\`\`${ex.language}\n${ex.code}\n\`\`\``
    ).join('\n\n')}\n`;
  }).join('\n\n---\n\n');
  
  fs.writeFileSync(
    path.join(EXAMPLES_DIR, 'index.md'),
    `# Usage Examples\n\n${indexContent}`
  );
  
  console.log(`✅ Generated ${allExamples.length} example files`);
  return allExamples;
}

if (require.main === module) {
  try {
    generateExamples();
  } catch (error) {
    console.error('Error generating examples:', error);
    process.exit(1);
  }
}

module.exports = { generateExamples, extractExamples };

