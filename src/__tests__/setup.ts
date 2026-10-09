import '@testing-library/jest-dom';

// Mock window.fetch if not present
if (!global.fetch) {
  // @ts-expect-error simple fetch mock
  global.fetch = vi.fn();
}
