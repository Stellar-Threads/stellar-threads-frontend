import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmationDialog } from '../components/common/ConfirmationDialog';

describe('ConfirmationDialog Tests', () => {
  it('should call onConfirm when action confirmed', () => {
    const handleConfirm = vi.fn();
    const handleCancel = vi.fn();

    render(
      <ConfirmationDialog
        isOpen={true}
        title="Release Escrow Funds"
        description="Are you sure you want to release 500 XLM?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    );

    fireEvent.click(screen.getByText('Confirm Action'));
    expect(handleConfirm).toHaveBeenCalled();
  });
});
