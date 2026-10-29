import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StatsMetricCard } from '../components/common/StatsMetricCard';

describe('StatsMetricCard Tests', () => {
  it('should render metric title and value', () => {
    render(
      <StatsMetricCard label="Active Escrow Volume" value="1,250 XLM" subValue="14 Active Contracts" />
    );
    expect(screen.getByText('Active Escrow Volume')).toBeInTheDocument();
    expect(screen.getByText('1,250 XLM')).toBeInTheDocument();
    expect(screen.getByText('14 Active Contracts')).toBeInTheDocument();
  });
});
