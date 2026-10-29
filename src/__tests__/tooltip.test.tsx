import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tooltip } from '../components/common/Tooltip';

describe('Tooltip Component Tests', () => {
  it('should show tooltip text upon mouse enter', () => {
    render(
      <Tooltip content="Protocol 22 TTL Bumps">
        <button>Hover Me</button>
      </Tooltip>
    );

    fireEvent.mouseEnter(screen.getByText('Hover Me'));
    expect(screen.getByText('Protocol 22 TTL Bumps')).toBeInTheDocument();
  });
});
