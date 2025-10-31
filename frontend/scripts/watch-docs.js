#!/usr/bin/env node

/**
 * Script to watch for code changes and auto-regenerate documentation
 * Uses nodemon to watch source files and regenerates TypeDoc docs on change
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const DOCS_DIR = path.join(__dirname, '../docs');
const SRC_DIR = path.join(__dirname, '../src');

console.log('📚 Starting documentation watcher...\n');
console.log('Watching:', SRC_DIR);
console.log('Output:', DOCS_DIR);
console.log('\nPress Ctrl+C to stop\n');

// Ensure docs directory exists
if (!fs.existsSync(DOCS_DIR)) {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
}

// Generate docs initially
console.log('🔨 Generating initial documentation...');
const generateDocs = () => {
  return new Promise((resolve, reject) => {
    const typedoc = spawn('npx', ['typedoc'], {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit',
      shell: true
    });

    typedoc.on('close', (code) => {
      if (code === 0) {
        console.log('✅ Documentation generated successfully\n');
        resolve();
      } else {
        console.error('❌ Documentation generation failed');
        reject(new Error(`Process exited with code ${code}`));
      }
    });
  });
};

// Watch for changes
const watch = spawn('nodemon', [
  '--watch', SRC_DIR,
  '--ext', 'ts,tsx',
  '--ignore', '**/*.test.ts,**/*.spec.ts,**/__tests__/**',
  '--exec', 'npx typedoc'
], {
  cwd: path.join(__dirname, '..'),
  stdio: 'inherit',
  shell: true
});

// Generate initial docs
generateDocs().catch(err => {
  console.error('Error generating initial docs:', err);
});

// Handle exit
process.on('SIGINT', () => {
  console.log('\n\n📚 Stopping documentation watcher...');
  watch.kill();
  process.exit(0);
});

watch.on('close', (code) => {
  console.log(`\n📚 Watcher stopped (code: ${code})`);
});

