import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DesignerTierBadge } from '../components/designer/DesignerTierBadge';

describe('DesignerTierBadge Tests', () => {
  it('should render Haute Couture tier styling', () => {
    render(<DesignerTierBadge tier="HauteCouture" />);
    expect(screen.getByText('Haute Couture')).toBeInTheDocument();
  });

  it('should render Verified Atelier tier styling', () => {
    render(<DesignerTierBadge tier="VerifiedAtelier" />);
    expect(screen.getByText('Verified Atelier')).toBeInTheDocument();
  });
});
