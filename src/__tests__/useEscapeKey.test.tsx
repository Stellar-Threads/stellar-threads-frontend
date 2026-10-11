import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { useEscapeKey } from '../hooks/useEscapeKey';

const TestComponent = ({ onEscape, enabled = true }: { onEscape: () => void; enabled?: boolean }) => {
  useEscapeKey(onEscape, enabled);
  return <div data-testid="test-modal">Modal Content</div>;
};

describe('useEscapeKey Hook', () => {
  it('triggers onEscape callback when Escape key is pressed', () => {
    const handleEscape = vi.fn();
    render(<TestComponent onEscape={handleEscape} enabled={true} />);

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(handleEscape).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onEscape when another key is pressed', () => {
    const handleEscape = vi.fn();
    render(<TestComponent onEscape={handleEscape} enabled={true} />);

    fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
    fireEvent.keyDown(window, { key: 'Tab', code: 'Tab' });
    expect(handleEscape).not.toHaveBeenCalled();
  });

  it('does not trigger onEscape when disabled', () => {
    const handleEscape = vi.fn();
    render(<TestComponent onEscape={handleEscape} enabled={false} />);

    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(handleEscape).not.toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const handleEscape = vi.fn();
    const { unmount } = render(<TestComponent onEscape={handleEscape} enabled={true} />);

    unmount();
    fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    expect(handleEscape).not.toHaveBeenCalled();
  });
});