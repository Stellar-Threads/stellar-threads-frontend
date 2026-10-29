import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NavigationTabs } from '../components/layout/NavigationTabs';

describe('NavigationTabs Tests', () => {
  it('should trigger onSelectTab when a tab is clicked', () => {
    const handleSelect = vi.fn();
    render(<NavigationTabs activeTab="overview" onSelectTab={handleSelect} />);

    const escrowsBtn = screen.getByText('Fashion Escrow');
    fireEvent.click(escrowsBtn);

    expect(handleSelect).toHaveBeenCalledWith('escrows');
  });
});
