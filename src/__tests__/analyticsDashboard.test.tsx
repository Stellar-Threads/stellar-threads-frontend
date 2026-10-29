import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProtocolAnalyticsDashboard } from '../components/analytics/ProtocolAnalyticsDashboard';

describe('ProtocolAnalyticsDashboard Tests', () => {
  it('should render all 4 protocol metrics cards', () => {
    render(<ProtocolAnalyticsDashboard />);
    expect(screen.getByText('Total Value Locked (TVL)')).toBeInTheDocument();
    expect(screen.getByText('Active Escrow Volume')).toBeInTheDocument();
    expect(screen.getByText('Minted Digital Passports')).toBeInTheDocument();
    expect(screen.getByText('Average Factoring APY')).toBeInTheDocument();
  });
});
