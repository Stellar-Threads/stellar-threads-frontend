import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SolvencyAuditorSection } from '../components/auditor/SolvencyAuditorSection';

describe('SolvencyAuditorSection Component Tests', () => {
  it('should render 100% solvent protocol verification badge', () => {
    render(<SolvencyAuditorSection />);
    expect(screen.getByText('Proof-of-Reserve Solvency Verification')).toBeInTheDocument();
    expect(screen.getByText('Protocol 100% Solvent')).toBeInTheDocument();
    expect(screen.getByText('100.00% (Zero Deficit)')).toBeInTheDocument();
  });
});
