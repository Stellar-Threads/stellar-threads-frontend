'use client';

import React, { useState, ReactNode } from 'react';

interface Props {
  content: string;
  children: ReactNode;
}

export function Tooltip({ content, children }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex items-center"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 whitespace-nowrap rounded-lg bg-neutral-950 border border-neutral-700 px-2.5 py-1 text-[11px] font-medium text-neutral-200 shadow-xl"
        >
          {content}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-neutral-950" />
        </div>
      )}
    </div>
  );
}
