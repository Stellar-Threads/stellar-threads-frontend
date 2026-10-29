import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QrCodeGenerator } from '../components/common/QrCodeGenerator';

describe('QrCodeGenerator Component Tests', () => {
  it('should render SVG element with correct product identifier', () => {
    render(<QrCodeGenerator value="PASSPORT-1001" size={140} />);
    expect(screen.getByText('PASSPORT-1001')).toBeInTheDocument();
  });
});
