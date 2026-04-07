import React from 'react';

const COLORS = {
  A: '#038141',
  B: '#85BB2F',
  C: '#FECB02',
  D: '#EE8100',
  E: '#E63E11'
};

export const NutriScoreLogo = ({ score, className = "h-12" }: { score: string, className?: string }) => {
  const s = score?.toUpperCase() || 'A';
  
  return (
    <svg viewBox="0 0 240 130" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="240" height="130" rx="15" fill="white" />
      
      {/* Text */}
      <text x="15" y="38" fontFamily="Arial, sans-serif" fontSize="28" fontWeight="900" fill="#333" letterSpacing="1">
        NUTRI-SCORE
      </text>

      {/* Shapes */}
      <g transform="translate(15, 55)">
        {/* Base Bar */}
        <path d="M 22.5 0 L 42 0 L 42 45 L 22.5 45 C 10 45 0 35 0 22.5 C 0 10 10 0 22.5 0 Z" fill={COLORS.A} />
        <rect x="42" y="0" width="42" height="45" fill={COLORS.B} />
        <rect x="84" y="0" width="42" height="45" fill={COLORS.C} />
        <rect x="126" y="0" width="42" height="45" fill={COLORS.D} />
        <path d="M 168 0 L 187.5 0 C 200 0 210 10 210 22.5 C 210 35 200 45 187.5 45 L 168 45 Z" fill={COLORS.E} />

        {/* Inactive Letters */}
        {s !== 'A' && <text x="21" y="32" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="900" fill="white" opacity="0.5" textAnchor="middle">A</text>}
        {s !== 'B' && <text x="63" y="32" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="900" fill="white" opacity="0.5" textAnchor="middle">B</text>}
        {s !== 'C' && <text x="105" y="32" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="900" fill="white" opacity="0.5" textAnchor="middle">C</text>}
        {s !== 'D' && <text x="147" y="32" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="900" fill="white" opacity="0.5" textAnchor="middle">D</text>}
        {s !== 'E' && <text x="189" y="32" fontFamily="Arial, sans-serif" fontSize="26" fontWeight="900" fill="white" opacity="0.5" textAnchor="middle">E</text>}

        {/* Active Shape */}
        {s === 'A' && (
          <g transform="translate(-6, -10)">
            <rect width="54" height="65" rx="27" fill={COLORS.A} stroke="white" strokeWidth="3" />
            <text x="27" y="46" fontFamily="Arial, sans-serif" fontSize="38" fontWeight="900" fill="white" textAnchor="middle">A</text>
          </g>
        )}
        {s === 'B' && (
          <g transform="translate(36, -10)">
            <rect width="54" height="65" rx="27" fill={COLORS.B} stroke="white" strokeWidth="3" />
            <text x="27" y="46" fontFamily="Arial, sans-serif" fontSize="38" fontWeight="900" fill="white" textAnchor="middle">B</text>
          </g>
        )}
        {s === 'C' && (
          <g transform="translate(78, -10)">
            <rect width="54" height="65" rx="27" fill={COLORS.C} stroke="white" strokeWidth="3" />
            <text x="27" y="46" fontFamily="Arial, sans-serif" fontSize="38" fontWeight="900" fill="white" textAnchor="middle">C</text>
          </g>
        )}
        {s === 'D' && (
          <g transform="translate(120, -10)">
            <rect width="54" height="65" rx="27" fill={COLORS.D} stroke="white" strokeWidth="3" />
            <text x="27" y="46" fontFamily="Arial, sans-serif" fontSize="38" fontWeight="900" fill="white" textAnchor="middle">D</text>
          </g>
        )}
        {s === 'E' && (
          <g transform="translate(162, -10)">
            <rect width="54" height="65" rx="27" fill={COLORS.E} stroke="white" strokeWidth="3" />
            <text x="27" y="46" fontFamily="Arial, sans-serif" fontSize="38" fontWeight="900" fill="white" textAnchor="middle">E</text>
          </g>
        )}
      </g>
    </svg>
  );
};
