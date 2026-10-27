import React from "react";

interface BrandMarkProps {
  className?: string;
  size?: number;
  reversed?: boolean;
}

/**
 * Minimalist luxury logo symbol for Ahmed Bello (Private Wealth Manager).
 * 
 * Design Concept:
 * A double arch like an architectural doorway / portal:
 * - A thick outer arch outline in muted forest green (#2e4a3b), open at the bottom.
 * - A thin inner arch outline in brass (#75581f) nested inside it, open at the bottom.
 * - Sitting on the baseline in the center is a small solid brass (#75581f) half-circle,
 *   evoking a rising sun on the horizon.
 * - Symmetrical, geometric precision, generous negative space, flat vector.
 * - On dark backgrounds (reversed), the outer arch is rendered in warm ivory (#f7f3eb)
 *   and the inner arch and rising sun are rendered in warm sand (#d6c298).
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  className = "w-8 h-8",
  size = 36,
  reversed = false,
}) => {
  // Color tokens
  const outerColor = reversed ? "#f7f3eb" : "#2e4a3b"; // Muted Forest / Warm Ivory
  const innerColor = reversed ? "#d6c298" : "#75581f"; // Architectural Brass / Warm Sand
  const sunColor = reversed ? "#d6c298" : "#75581f";   // Rising Sun in Brass / Sand

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      role="img"
      aria-label="Ahmed Bello Portal Symbol"
    >
      <title>Ahmed Bello Portal Symbol</title>
      
      {/* 1. Outer Arch: Thick outline in muted forest green, open at the bottom with flat square terminals */}
      <path
        d="M 29,84 L 29,38 A 21,21 0 0,1 71,38 L 71,84"
        stroke={outerColor}
        strokeWidth="3.8"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />

      {/* 2. Inner Arch: Thin outline in brass, nested inside with uniform negative space */}
      <path
        d="M 35.5,84 L 35.5,38 A 14.5,14.5 0 0,1 64.5,38 L 64.5,84"
        stroke={innerColor}
        strokeWidth="1.6"
        strokeLinecap="butt"
        strokeLinejoin="round"
      />

      {/* 3. Rising Sun: Small solid brass semicircle sitting on the baseline in the center */}
      <path
        d="M 41.5,84 A 8.5,8.5 0 0,1 58.5,84 Z"
        fill={sunColor}
      />
    </svg>
  );
};
