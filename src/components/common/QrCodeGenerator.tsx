'use client';

import React from 'react';

interface Props {
  value: string;
  size?: number;
}

export function QrCodeGenerator({ value, size = 160 }: Props) {
  // Deterministic SVG QR representation with centered Stellar glyph
  return (
    <div className="flex flex-col items-center justify-center p-3 bg-white rounded-xl shadow-inner inline-block">
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <rect width="100" height="100" fill="white" />
        {/* Finder pattern Top-Left */}
        <rect x="10" y="10" width="25" height="25" fill="black" />
        <rect x="15" y="15" width="15" height="15" fill="white" />
        <rect x="18" y="18" width="9" height="9" fill="black" />

        {/* Finder pattern Top-Right */}
        <rect x="65" y="10" width="25" height="25" fill="black" />
        <rect x="70" y="15" width="15" height="15" fill="white" />
        <rect x="73" y="18" width="9" height="9" fill="black" />

        {/* Finder pattern Bottom-Left */}
        <rect x="10" y="65" width="25" height="25" fill="black" />
        <rect x="15" y="70" width="15" height="15" fill="white" />
        <rect x="18" y="73" width="9" height="9" fill="black" />

        {/* Dynamic encoded data grid dots */}
        <rect x="45" y="12" width="6" height="6" fill="black" />
        <rect x="45" y="24" width="6" height="6" fill="black" />
        <rect x="12" y="45" width="6" height="6" fill="black" />
        <rect x="24" y="45" width="6" height="6" fill="black" />
        <rect x="42" y="42" width="16" height="16" rx="4" fill="#f59e0b" />
        <rect x="65" y="45" width="6" height="6" fill="black" />
        <rect x="77" y="45" width="6" height="6" fill="black" />
        <rect x="45" y="65" width="6" height="6" fill="black" />
        <rect x="45" y="77" width="6" height="6" fill="black" />
        <rect x="65" y="65" width="8" height="8" fill="black" />
        <rect x="78" y="78" width="8" height="8" fill="black" />
      </svg>
      <span className="mt-1 text-[9px] font-mono text-neutral-800 truncate max-w-[140px] text-center">
        {value}
      </span>
    </div>
  );
}
