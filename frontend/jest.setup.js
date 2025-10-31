// Jest setup file (alternative to TypeScript setup)
// This file is used if setupTests.ts is not available

// Add any global test setup here
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};

