import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EscrowMilestoneProgress } from '../components/escrow/EscrowMilestoneProgress';

describe('EscrowMilestoneProgress Tests', () => {
  it('should render all 4 milestone stages', () => {
    render(<EscrowMilestoneProgress currentStage={2} />);
    expect(screen.getByText('Deposit')).toBeInTheDocument();
    expect(screen.getByText('Production')).toBeInTheDocument();
    expect(screen.getByText('Inspection')).toBeInTheDocument();
    expect(screen.getByText('Settlement')).toBeInTheDocument();
  });
});
