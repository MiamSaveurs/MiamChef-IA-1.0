
import React from 'react';

// --- STYLE GLOBAL : RÉALISME, GRADIENTS ET RELIEF (EFFET DÉTOURÉ) ---

export const WickerBasket = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M30 45C30 30 38 20 50 20C62 20 70 30 70 45" stroke="#C08E5E" strokeWidth="6" strokeLinecap="round"/>
    <path d="M35 45C35 35 42 28 50 28C58 28 65 35 65 45" stroke="#A6784D" strokeWidth="4" strokeLinecap="round"/>
    <path d="M20 45C20 45 22 80 30 85C38 90 62 90 70 85C78 80 80 45 80 45H20Z" fill="#D9A066" />
    <path d="M22 55H78" stroke="#A6784D" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M25 65H75" stroke="#A6784D" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M28 75H72" stroke="#A6784D" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <rect x="18" y="42" width="64" height="8" rx="4" fill="#C08E5E" />
  </svg>
);

export const GourmetBook = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25 20V80C25 82.7614 27.2386 85 30 85H75C77.7614 85 80 82.7614 80 80V20C80 17.2386 77.7614 15 75 15H30C27.2386 15 25 17.2386 25 20Z" fill="#5D4037" />
    <rect x="30" y="15" width="50" height="70" rx="3" fill="#8D6E63" />
    <rect x="40" y="30" width="30" height="2" rx="1" fill="#FFD54F" opacity="0.6" />
    <path d="M45 55V65H55V55C55 52 52 50 50 50C48 50 45 52 45 55Z" fill="#FFD54F" opacity="0.8" />
  </svg>
);

export const PremiumChefHat = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25 55C25 40 35 30 50 30C65 30 75 40 75 55V65H25V55Z" fill="white" />
    <path d="M25 55C25 40 35 30 50 30C65 30 75 40 75 55" stroke="#E0E0E0" strokeWidth="1" />
    <rect x="25" y="65" width="50" height="15" rx="2" fill="#F5F5F5" />
    <rect x="25" y="65" width="50" height="15" rx="2" stroke="#E0E0E0" strokeWidth="1" />
    <path d="M35 72H65" stroke="#509f2a" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
    <path d="M40 35C40 35 45 32 50 32C55 32 60 35 60 35" stroke="#E0E0E0" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export const PremiumCamera = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="15" y="35" width="70" height="45" rx="8" fill="#333" />
    <rect x="35" y="25" width="30" height="10" rx="2" fill="#222" />
    <circle cx="50" cy="57" r="20" fill="#444" stroke="#555" strokeWidth="2" />
    <circle cx="50" cy="57" r="12" fill="url(#lensGradient)" />
    <circle cx="45" cy="52" r="3" fill="white" opacity="0.3" />
    <rect x="70" y="42" width="8" height="5" rx="1" fill="#509f2a" opacity="0.8" />
    <defs>
      <radialGradient id="lensGradient" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(50 57) rotate(90) scale(12)">
        <stop offset="0" stopColor="#1a3b5c" />
        <stop offset="1" stopColor="#0a1a2a" />
      </radialGradient>
    </defs>
  </svg>
);

export const PremiumWine = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M35 20C35 20 35 55 50 55C65 55 65 20 65 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    <path d="M37 35C37 35 37 53 50 53C63 53 63 35 63 35H37Z" fill="url(#wineGradient)" />
    <path d="M50 55V85" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    <path d="M35 85H65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    <path d="M42 38L58 38" stroke="currentColor" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
    <defs>
      <linearGradient id="wineGradient" x1="50" y1="35" x2="50" y2="53" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#991b1b" />
        <stop offset="1" stopColor="#4a1a1a" />
      </linearGradient>
    </defs>
  </svg>
);

export const PremiumCalendar = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="20" y="25" width="60" height="55" rx="6" fill="white" />
    <path d="M20 25H80V40H20V25Z" fill="#509f2a" />
    <rect x="30" y="18" width="6" height="12" rx="2" fill="#333" />
    <rect x="64" y="18" width="6" height="12" rx="2" fill="#333" />
    <rect x="30" y="50" width="10" height="2" rx="1" fill="#E0E0E0" />
    <rect x="30" y="60" width="40" height="2" rx="1" fill="#E0E0E0" />
    <rect x="30" y="70" width="25" height="2" rx="1" fill="#E0E0E0" />
  </svg>
);

export const PremiumTimer = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="55" r="35" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="4" />
    <circle cx="50" cy="55" r="28" stroke="#509f2a" strokeWidth="2" strokeDasharray="2 4" />
    <path d="M50 55L50 35" stroke="#333" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 55L65 55" stroke="#eb5757" strokeWidth="2" strokeLinecap="round" />
    <rect x="40" y="15" width="20" height="6" rx="1" fill="#333" />
    <circle cx="50" cy="55" r="4" fill="#333" />
  </svg>
);

export const PremiumHome = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 50L50 20L80 50V80C80 82.7614 77.7614 85 75 85H25C22.2386 85 20 82.7614 20 80V50Z" fill="#509f2a" opacity="0.1" />
    <path d="M20 50L50 20L80 50" stroke="#509f2a" strokeWidth="6" strokeLinecap="round" strokeJoin="round" />
    <path d="M30 50V80C30 82.7614 32.2386 85 35 85H65C67.7614 85 70 82.7614 70 80V50" stroke="#509f2a" strokeWidth="4" strokeLinecap="round" strokeJoin="round" />
    <rect x="45" y="65" width="10" height="20" fill="#509f2a" />
  </svg>
);

export const PremiumFingerprint = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 20C33.4315 20 20 33.4315 20 50C20 66.5685 33.4315 80 50 80C66.5685 80 80 66.5685 80 50" stroke="#509f2a" strokeWidth="4" strokeLinecap="round" opacity="0.3"/>
    <path d="M35 50C35 41.7157 41.7157 35 50 35C58.2843 35 65 41.7157 65 50" stroke="#509f2a" strokeWidth="6" strokeLinecap="round" />
    <path d="M42 60C42 55.5817 45.5817 52 50 52C54.4183 52 58 55.5817 58 60" stroke="#509f2a" strokeWidth="4" strokeLinecap="round" />
    <path d="M28 50C28 37.8497 37.8497 28 50 28C62.1503 28 72 37.8497 72 50" stroke="#509f2a" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
  </svg>
);

export const PremiumHeart = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 80C50 80 20 62 20 40C20 28 30 20 40 20C45 20 48 22 50 25C52 22 55 20 60 20C70 20 80 28 80 40C80 62 50 80 50 80Z" fill="#eb5757" />
    <path d="M35 32C30 35 28 40 28 40" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
    <path d="M30 60L45 45L55 55L70 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeJoin="round" opacity="0.8" />
  </svg>
);

export const PremiumEuro = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="40" fill="#2d9cdb" />
    <path d="M65 35C60 30 50 30 45 35C38 42 38 58 45 65C50 70 60 70 65 65" stroke="white" strokeWidth="8" strokeLinecap="round" />
    <path d="M35 45H55" stroke="white" strokeWidth="6" strokeLinecap="round" />
    <path d="M35 55H55" stroke="white" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const PremiumCrown = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 70L30 40L50 60L70 40L80 70H20Z" fill="#facc15" />
    <circle cx="30" cy="40" r="4" fill="#facc15" />
    <circle cx="50" cy="60" r="4" fill="#facc15" />
    <circle cx="70" cy="40" r="4" fill="#facc15" />
    <rect x="20" y="70" width="60" height="8" rx="2" fill="#ca8a04" />
    <circle cx="50" cy="74" r="2" fill="#ef4444" />
  </svg>
);

export const PremiumGlobe = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="40" fill="#3b82f6" />
    <path d="M50 10V90" stroke="white" strokeWidth="2" opacity="0.3" />
    <path d="M10 50H90" stroke="white" strokeWidth="2" opacity="0.3" />
    <ellipse cx="50" cy="50" rx="15" ry="40" stroke="white" strokeWidth="2" opacity="0.3" />
    <path d="M15 30C30 35 70 35 85 30" stroke="white" strokeWidth="2" opacity="0.3" />
    <path d="M15 70C30 65 70 65 85 70" stroke="white" strokeWidth="2" opacity="0.3" />
    <path d="M50 10C65 10 75 30 75 50C75 70 65 90 50 90" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const PremiumLayers = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 40L50 25L80 40L50 55L20 40Z" fill="#509f2a" />
    <path d="M20 55L50 70L80 55" stroke="#509f2a" strokeWidth="6" strokeLinecap="round" strokeJoin="round" opacity="0.6" />
    <path d="M20 70L50 85L80 70" stroke="#509f2a" strokeWidth="6" strokeLinecap="round" strokeJoin="round" opacity="0.3" />
  </svg>
);

export const PremiumBriefcase = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="15" y="30" width="70" height="50" rx="4" fill="#795548" />
    <path d="M40 30V20C40 17.2386 42.2386 15 45 15H55C57.7614 15 60 17.2386 60 20V30" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" />
    <rect x="42" y="50" width="16" height="10" rx="2" fill="#D4AF37" />
    <line x1="15" y1="45" x2="85" y2="45" stroke="#5D4037" strokeWidth="2" />
  </svg>
);

export const PremiumShield = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15L85 25V55C85 75 50 85 50 85C50 85 15 75 15 55V25L50 15Z" fill="#607D8B" />
    <path d="M35 50L45 60L65 40" stroke="white" strokeWidth="8" strokeLinecap="round" strokeJoin="round" />
    <path d="M50 18L82 27V55C82 72 50 82 50 82V18Z" fill="white" opacity="0.1" />
  </svg>
);
