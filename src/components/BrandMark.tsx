import React from "react";

interface BrandMarkProps {
  className?: string;
  size?: number;
  reversed?: boolean;
  variant?: "keystone" | "monoline" | "editorial";
}

/**
 * Creative Minimalist Luxury Logo Mark for Ahmed Bello (Private Wealth & Financial Solutions).
 * 
 * Geometry & Creative Concept:
 * - A monogram where the letters A and B share one vertical stem (the Pillar of Trust).
 * - The left diagonal of the A rises from the baseline at an intentional 64° trajectory,
 *   anchored by a horizontal foot-cut at the baseline (immovable stability) and miters
 *   cleanly into the apex crown at (50, 16).
 * - The shared vertical stem anchors the central axis from (50, 16) to (50, 84).
 * - The waist of the B extends horizontally leftward as the crossbar of the A,
 *   forming the Connecting Horizon ("Your money questions are connected").
 * - The B is sculpted from two stacked vaults, proportioned according to the classical
 *   Golden Ratio: an agile, compact upper vault and an expansive, grounded lower vault.
 * - Both counterforms (apertures) are 100% transparent vector negative space, allowing
 *   the ivory ground or dark forest to breathe through the monogram.
 * - Flat vector, zero gradients, zero shadows, pure geometric precision.
 */
export const BrandMark: React.FC<BrandMarkProps> = ({
  className = "w-8 h-8",
  size = 36,
  reversed = false,
  variant = "keystone",
}) => {
  // Color tokens
  const diagonalColor = reversed ? "#f7f3eb" : "#1c1b18"; // Ink / Ivory
  const brassColor = reversed ? "#d6c298" : "#75581f";     // Sand / Brass
  const pillarColor = reversed ? "#d6c298" : "#75581f";

  if (variant === "monoline") {
    // Monoline Swiss Precision with ground terminal cuts
    const sw = 4.2;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className={className}
        fill="none"
        role="img"
        aria-label="Ahmed Bello Monogram"
      >
        <title>Ahmed Bello Monogram</title>
        {/* Left leg of A with flat baseline cut */}
        <path
          d="M 18,84 L 23,84 L 50,16 L 45,16 Z"
          fill={diagonalColor}
        />
        {/* Vertical stem */}
        <line
          x1="50"
          y1="16"
          x2="50"
          y2="84"
          stroke={brassColor}
          strokeWidth={sw}
          strokeLinecap="butt"
        />
        {/* Extended crossbar */}
        <line
          x1="34"
          y1="47"
          x2="64"
          y2="47"
          stroke={brassColor}
          strokeWidth={sw}
          strokeLinecap="butt"
        />
        {/* Upper bowl */}
        <path
          d="M 50,16 L 64,16 C 72.5,16 77,21.5 77,31.5 C 77,41.5 72.5,47 64,47"
          stroke={brassColor}
          strokeWidth={sw}
          strokeLinecap="butt"
        />
        {/* Lower bowl */}
        <path
          d="M 64,47 C 74.5,47 80,54.5 80,65.5 C 80,76.5 74.5,84 64,84 L 50,84"
          stroke={brassColor}
          strokeWidth={sw}
          strokeLinecap="butt"
        />
      </svg>
    );
  }

  // Primary Masterpiece: The Architectural Keystone Monogram
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      fill="none"
      role="img"
      aria-label="Ahmed Bello Monogram"
    >
      <title>Ahmed Bello Monogram</title>
      
      {/* 1. The Left Diagonal of A:
             Architectural pylon with flat ground cut at baseline y=84 and mitered apex crown at y=16 */}
      <path
        d="M 18,84 L 23,84 L 50,16 L 45,16 Z"
        fill={diagonalColor}
      />

      {/* 2. The Shared Vertical Pillar:
             The central column of trust, running continuously from (47.9, 16) to (52.1, 84) */}
      <path
        d="M 47.9,16 L 52.1,16 L 52.1,84 L 47.9,84 Z"
        fill={pillarColor}
      />

      {/* 3. The Horizon Crossbar / Waist of B:
             Extends from the diagonal of A (x=33.8) through the stem into the waist of B (x=63.5) */}
      <path
        d="M 33.8,44.9 L 63.5,44.9 L 63.5,49.1 L 33.8,49.1 Z"
        fill={brassColor}
      />

      {/* 4. Upper Vault of the B:
             Compact, agile chamber sculpted with evenodd transparent negative space */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 52.1,16 L 63.5,16 C 72.5,16 77,21.5 77,30.5 C 77,39.5 72.5,45 63.5,45 L 52.1,45 Z
           M 52.1,20.2 L 63,20.2 C 69.5,20.2 72.8,24 72.8,30.5 C 72.8,37 69.5,40.8 63,40.8 L 52.1,40.8 Z"
        fill={brassColor}
      />

      {/* 5. Lower Vault of the B:
             Grounded foundation chamber with expanded radius and transparent negative space */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M 52.1,45 L 64.5,45 C 74.5,45 80,52 80,64.5 C 80,77 74.5,84 64.5,84 L 52.1,84 Z
           M 52.1,49.1 L 64,49.1 C 71.5,49.1 75.8,55 75.8,64.5 C 75.8,74 71.5,79.8 64,79.8 L 52.1,79.8 Z"
        fill={brassColor}
      />
    </svg>
  );
};
