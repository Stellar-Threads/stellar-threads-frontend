import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

function ProblemChild({ shouldThrow }: { shouldThrow: boolean }) {
  if (shouldThrow) {
    throw new Error('Simulated contract render explosion');
  }
  return <div>Component Rendered Normal</div>;
}

describe('ErrorBoundary Component Tests', () => {
  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <ProblemChild shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByText('Component Rendered Normal')).toBeInTheDocument();
  });

  it('should catch render error and display fallback UI', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary fallbackTitle="Custom Escrow Error">
        <ProblemChild shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Escrow Error')).toBeInTheDocument();
    expect(screen.getByText('Simulated contract render explosion')).toBeInTheDocument();
    expect(screen.getByText('Retry Component')).toBeInTheDocument();
    consoleSpy.mockRestore();
  });
});
