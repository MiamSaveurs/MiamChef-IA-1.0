
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
  </svg>
);

export const PremiumCake = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="20" y="55" width="60" height="25" rx="4" fill="#FCE4EC" />
    <rect x="25" y="40" width="50" height="15" rx="3" fill="#F8BBD0" />
    <path d="M30 40C30 35 35 30 50 30C65 30 70 35 70 40" stroke="#F06292" strokeWidth="2" strokeDasharray="4 2" opacity="0.5"/>
    <circle cx="50" cy="25" r="5" fill="#E91E63" />
    <path d="M50 25L50 15" stroke="#FFD54F" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const PremiumCroissant = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 60C20 40 40 25 50 25C60 25 80 40 80 60" stroke="#8D6E63" strokeWidth="12" strokeLinecap="round" />
    <path d="M25 55C25 45 40 35 50 35C60 35 75 45 75 55" stroke="#A1887F" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
    <path d="M35 35L40 50M50 30V45M65 35L60 50" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
  </svg>
);

export const PremiumSparkles = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15L55 45L85 50L55 55L50 85L45 55L15 50L45 45L50 15Z" fill="#FFD54F" />
    <path d="M75 20L78 30L88 33L78 36L75 46L72 36L62 33L72 30L75 20Z" fill="#FFB300" opacity="0.7" />
    <circle cx="50" cy="50" r="10" fill="white" opacity="0.4">
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
    </circle>
  </svg>
);

export const PremiumSearch = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="45" cy="45" r="30" stroke="#509f2a" strokeWidth="8" />
    <circle cx="45" cy="45" r="22" fill="#509f2a" opacity="0.05" />
    <line x1="68" y1="68" x2="88" y2="88" stroke="#509f2a" strokeWidth="10" strokeLinecap="round" />
    <path d="M35 35C35 35 38 32 42 32" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
  </svg>
);

export const PremiumUsers = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="35" r="15" fill="#444" />
    <path d="M25 75C25 60 35 50 50 50C65 50 75 60 75 75V85H25V75Z" fill="#333" />
    <circle cx="30" cy="45" r="10" fill="#666" opacity="0.6" />
    <path d="M10 80C10 70 15 65 25 65C35 65 40 70 40 80V85H10V80Z" fill="#555" opacity="0.6" />
  </svg>
);

export const PremiumLeaf = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 85C50 85 80 65 80 40C80 20 60 15 50 15C40 15 20 20 20 40C20 65 50 85 50 85Z" fill="#81C784" />
    <path d="M50 85V15" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" />
    <path d="M50 65L70 45M50 50L65 35M50 65L30 45M50 50L35 35" stroke="#2E7D32" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
  </svg>
);

export const PremiumWheat = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 90V20" stroke="#DAA520" strokeWidth="4" strokeLinecap="round" />
    <path d="M48 90V20" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.2" />
    <ellipse cx="40" cy="35" rx="8" ry="12" fill="url(#wheatGrad)" />
    <ellipse cx="60" cy="45" rx="8" ry="12" fill="url(#wheatGrad)" />
    <ellipse cx="40" cy="55" rx="8" ry="12" fill="url(#wheatGrad)" />
    <ellipse cx="60" cy="65" rx="8" ry="12" fill="url(#wheatGrad)" />
    <ellipse cx="50" cy="20" rx="6" ry="10" fill="url(#wheatGrad)" />
    <defs>
      <linearGradient id="wheatGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFD54F" />
        <stop offset="1" stopColor="#DAA520" />
      </linearGradient>
    </defs>
  </svg>
);

export const PremiumUtensils = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="35" y="20" width="8" height="40" rx="4" fill="#9E9E9E" />
    <path d="M35 30V20C35 20 40 15 45 20V30" stroke="#757575" strokeWidth="2" opacity="0.5"/>
    <path d="M60 20L65 60H55L60 20Z" fill="#BDBDBD" />
    <rect x="58" y="60" width="4" height="20" rx="1" fill="#757575" />
    <rect x="37" y="60" width="4" height="20" rx="1" fill="#757575" />
  </svg>
);

export const PremiumMedal = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M30 15L50 40L70 15" stroke="#eb5757" strokeWidth="12" strokeLinecap="round" />
    <circle cx="50" cy="60" r="25" fill="#FFD54F" stroke="#FBC02D" strokeWidth="4" />
    <circle cx="50" cy="60" r="18" stroke="white" strokeWidth="1" opacity="0.3" />
    <path d="M45 55L50 65L55 55" stroke="#FBC02D" strokeWidth="4" strokeLinecap="round" strokeJoin="round" />
  </svg>
);

export const PremiumPlus = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="40" fill="white" opacity="0.1" />
    <rect x="45" y="25" width="10" height="50" rx="5" fill="currentColor" />
    <rect x="25" y="45" width="50" height="10" rx="5" fill="currentColor" />
  </svg>
);

export const PremiumShoppingCart = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 20H30L40 70H80L90 35H35" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeJoin="round" />
    <circle cx="45" cy="85" r="7" fill="currentColor" />
    <circle cx="75" cy="85" r="7" fill="currentColor" />
    <rect x="45" y="40" width="30" height="15" rx="2" fill="currentColor" opacity="0.2" />
  </svg>
);

export const PremiumPlay = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M35 25L75 50L35 75V25Z" fill="currentColor" />
    <path d="M38 35L65 50L38 65" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
  </svg>
);

export const PremiumDownload = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 20V65" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <path d="M30 45L50 65L70 45" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeJoin="round" />
    <path d="M20 80H80" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

export const PremiumVideo = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="15" y="30" width="50" height="40" rx="6" fill="currentColor" />
    <path d="M65 40L85 30V70L65 60V40Z" fill="currentColor" />
    <circle cx="35" cy="50" r="5" fill="white" opacity="0.3" />
  </svg>
);

export const PremiumVolume = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 40H35L55 20V80L35 60H20V40Z" fill="currentColor" />
    <path d="M65 35C70 40 70 60 65 65" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.5" />
    <path d="M75 25C85 35 85 65 75 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity="0.3" />
  </svg>
);

export const PremiumMic = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="40" y="15" width="20" height="45" rx="10" fill="currentColor" />
    <path d="M25 45C25 60 35 70 50 70C65 70 75 60 75 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <line x1="50" y1="70" x2="50" y2="85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <line x1="35" y1="85" x2="65" y2="85" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const PremiumMicOff = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M40 15V45" stroke="currentColor" strokeWidth="8" strokeLinecap="round" opacity="0.3" />
    <path d="M50 70C65 70 75 60 75 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    <line x1="20" y1="20" x2="80" y2="80" stroke="#eb5757" strokeWidth="10" strokeLinecap="round" />
  </svg>
);

export const PremiumX = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <line x1="25" y1="25" x2="75" y2="75" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
    <line x1="75" y1="25" x2="25" y2="75" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
  </svg>
);

export const PremiumMapPin = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15C33 15 20 28 20 45C20 65 50 85 50 85C50 85 80 65 80 45C80 28 67 15 50 15Z" fill="#eb5757" />
    <circle cx="50" cy="45" r="10" fill="white" />
    <ellipse cx="50" cy="85" rx="15" ry="5" fill="black" opacity="0.1" />
  </svg>
);

export const PremiumStore = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="20" y="45" width="60" height="40" fill="currentColor" opacity="0.2" />
    <path d="M15 45L50 20L85 45" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeJoin="round" />
    <rect x="35" y="65" width="10" height="20" fill="currentColor" />
    <rect x="55" y="65" width="10" height="10" fill="currentColor" />
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

export const PremiumTrash = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25 30H75" stroke="#eb5757" strokeWidth="8" strokeLinecap="round" />
    <path d="M35 30V20C35 17.2386 37.2386 15 40 15H60C62.7614 15 65 17.2386 65 20V30" stroke="#eb5757" strokeWidth="6" strokeLinecap="round" />
    <path d="M30 30L35 80C35 82.7614 37.2386 85 40 85H60C62.7614 85 65 82.7614 65 80L70 30" fill="#eb5757" opacity="0.1" />
    <path d="M30 30L35 80C35 82.7614 37.2386 85 40 85H60C62.7614 85 65 82.7614 65 80L70 30" stroke="#eb5757" strokeWidth="6" strokeLinecap="round" strokeJoin="round" />
    <line x1="45" y1="45" x2="45" y2="70" stroke="#eb5757" strokeWidth="4" strokeLinecap="round" />
    <line x1="55" y1="45" x2="55" y2="70" stroke="#eb5757" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const PremiumCoffee = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25 40H65V70C65 78.2843 58.2843 85 50 85H40C31.7157 85 25 78.2843 25 70V40Z" fill="#795548" />
    <path d="M65 45H75C80.5228 45 85 49.4772 85 55V60C85 65.5228 80.5228 70 75 70H65" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" />
    <path d="M40 15C40 15 42 25 40 30M50 15C50 15 52 25 50 30M60 15C60 15 62 25 60 30" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <circle cx="45" cy="62" r="10" stroke="white" strokeWidth="2" opacity="0.2" />
  </svg>
);

export const PremiumSoup = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 40C20 40 20 80 50 80C80 80 80 40 80 40" fill="#509f2a" opacity="0.1" />
    <path d="M15 40H85" stroke="#509f2a" strokeWidth="8" strokeLinecap="round" />
    <path d="M20 40C20 40 22 75 50 75C78 75 80 40 80 40" stroke="#509f2a" strokeWidth="6" strokeLinecap="round" strokeJoin="round" />
    <path d="M45 15L55 45" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round" />
    <circle cx="55" cy="50" r="12" fill="#9E9E9E" opacity="0.2" />
    <path d="M35 55L45 55M55 55L65 55" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
  </svg>
);

export const PremiumCheck = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="40" fill="#509f2a" />
    <path d="M30 50L45 65L70 35" stroke="white" strokeWidth="10" strokeLinecap="round" strokeJoin="round" />
    <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="1" opacity="0.2" />
  </svg>
);

export const PremiumAlertCircle = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="40" fill="#eb5757" />
    <rect x="46" y="25" width="8" height="30" rx="4" fill="white" />
    <circle cx="50" cy="70" r="5" fill="white" />
  </svg>
);

export const PremiumChevronDown = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M30 40L50 60L70 40" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeJoin="round" />
  </svg>
);

export const PremiumRotateCcw = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80C40 80 32 75 25 68" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <path d="M15 68L25 68V58" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeJoin="round" />
    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" opacity="0.1" />
  </svg>
);

export const PremiumPause = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="30" y="25" width="12" height="50" rx="4" fill="currentColor" />
    <rect x="58" y="25" width="12" height="50" rx="4" fill="currentColor" />
    <rect x="33" y="28" width="6" height="44" rx="2" fill="white" opacity="0.1" />
    <rect x="61" y="28" width="6" height="44" rx="2" fill="white" opacity="0.1" />
  </svg>
);

export const PremiumMinus = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="25" y="45" width="50" height="10" rx="5" fill="currentColor" />
    <rect x="25" y="47" width="50" height="3" rx="1" fill="white" opacity="0.1" />
  </svg>
);

export const PremiumFlame = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 10C50 10 75 35 75 60C75 73.8071 63.8071 85 50 85C36.1929 85 25 73.8071 25 60C25 35 50 10 50 10Z" fill="url(#flameGrad1)" />
    <path d="M50 30C50 30 65 45 65 60C65 68.2843 58.2843 75 50 75C41.7157 75 35 68.2843 35 60C35 45 50 30 50 30Z" fill="url(#flameGrad2)" />
    <path d="M50 50C50 50 58 58 58 65C58 69.4183 54.4183 73 50 73C45.5817 73 42 69.4183 42 65C42 58 50 50 50 50Z" fill="#fff176" />
    <defs>
      <linearGradient id="flameGrad1" x1="50" y1="10" x2="50" y2="85">
        <stop offset="0" stopColor="#ff7043" />
        <stop offset="1" stopColor="#d84315" />
      </linearGradient>
      <linearGradient id="flameGrad2" x1="50" y1="30" x2="50" y2="75">
        <stop offset="0" stopColor="#ffb74d" />
        <stop offset="1" stopColor="#ef6c00" />
      </linearGradient>
    </defs>
  </svg>
);

export const PremiumDroplet = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15C50 15 80 45 80 65C80 81.5685 66.5685 95 50 95C33.4315 95 20 81.5685 20 65C20 45 50 15 50 15Z" fill="url(#dropGrad)" />
    <path d="M40 55C35 60 35 65 35 65" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
    <circle cx="48" cy="40" r="5" fill="white" opacity="0.3" />
    <defs>
      <linearGradient id="dropGrad" x1="50" y1="15" x2="50" y2="95">
        <stop offset="0" stopColor="#4fc3f7" />
        <stop offset="1" stopColor="#0288d1" />
      </linearGradient>
    </defs>
  </svg>
);

export const PremiumEgg = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15C35 15 20 35 20 60C20 76.5685 33.4315 90 50 90C66.5685 90 80 76.5685 80 60C80 35 65 15 50 15Z" fill="url(#eggGrad)" />
    <path d="M50 15C35 15 20 35 20 60C20 76.5685 33.4315 90 50 90C66.5685 90 80 76.5685 80 60" stroke="#D1D1D1" strokeWidth="1" />
    <ellipse cx="40" cy="40" rx="8" ry="12" fill="white" opacity="0.6" />
    <path d="M35 70C40 80 60 80 65 70" stroke="#FBC02D" strokeWidth="4" strokeLinecap="round" opacity="0.1" />
    <defs>
      <radialGradient id="eggGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F5F5F5" />
      </radialGradient>
    </defs>
  </svg>
);

// Correct duplicate/invalid type and property definition.
export const PremiumBeef = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 50C20 30 40 20 65 20C85 20 90 40 85 60C75 80 45 85 25 75C15 65 20 50 20 50Z" fill="url(#meatGrad)" />
    <path d="M30 45L45 35M35 60L55 45M50 75L75 55" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
    <path d="M60 25C70 25 75 30 75 40" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    <circle cx="70" cy="35" r="5" fill="#ef5350" opacity="0.4" />
    <defs>
      <linearGradient id="meatGrad" x1="20" y1="20" x2="85" y2="85">
        <stop offset="0" stopColor="#c62828" />
        <stop offset="1" stopColor="#8e0000" />
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

export const PremiumTrash = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25 30H75" stroke="#eb5757" strokeWidth="8" strokeLinecap="round" />
    <path d="M35 30V20C35 17.2386 37.2386 15 40 15H60C62.7614 15 65 17.2386 65 20V30" stroke="#eb5757" strokeWidth="6" strokeLinecap="round" />
    <path d="M30 30L35 80C35 82.7614 37.2386 85 40 85H60C62.7614 85 65 82.7614 65 80L70 30" fill="#eb5757" opacity="0.1" />
    <path d="M30 30L35 80C35 82.7614 37.2386 85 40 85H60C62.7614 85 65 82.7614 65 80L70 30" stroke="#eb5757" strokeWidth="6" strokeLinecap="round" strokeJoin="round" />
    <line x1="45" y1="45" x2="45" y2="70" stroke="#eb5757" strokeWidth="4" strokeLinecap="round" />
    <line x1="55" y1="45" x2="55" y2="70" stroke="#eb5757" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const PremiumCoffee = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M25 40H65V70C65 78.2843 58.2843 85 50 85H40C31.7157 85 25 78.2843 25 70V40Z" fill="#795548" />
    <path d="M65 45H75C80.5228 45 85 49.4772 85 55V60C85 65.5228 80.5228 70 75 70H65" stroke="#5D4037" strokeWidth="6" strokeLinecap="round" />
    <path d="M40 15C40 15 42 25 40 30M50 15C50 15 52 25 50 30M60 15C60 15 62 25 60 30" stroke="#BDBDBD" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
    <circle cx="45" cy="62" r="10" stroke="white" strokeWidth="2" opacity="0.2" />
  </svg>
);

export const PremiumSoup = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 40C20 40 20 80 50 80C80 80 80 40 80 40" fill="#509f2a" opacity="0.1" />
    <path d="M15 40H85" stroke="#509f2a" strokeWidth="8" strokeLinecap="round" />
    <path d="M20 40C20 40 22 75 50 75C78 75 80 40 80 40" stroke="#509f2a" strokeWidth="6" strokeLinecap="round" strokeJoin="round" />
    <path d="M45 15L55 45" stroke="#9E9E9E" strokeWidth="4" strokeLinecap="round" />
    <circle cx="55" cy="50" r="12" fill="#9E9E9E" opacity="0.2" />
    <path d="M35 55L45 55M55 55L65 55" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
  </svg>
);

export const PremiumCheck = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="40" fill="#509f2a" />
    <path d="M30 50L45 65L70 35" stroke="white" strokeWidth="10" strokeLinecap="round" strokeJoin="round" />
    <circle cx="50" cy="50" r="35" stroke="white" strokeWidth="1" opacity="0.2" />
  </svg>
);

export const PremiumAlertCircle = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="50" cy="50" r="40" fill="#eb5757" />
    <rect x="46" y="25" width="8" height="30" rx="4" fill="white" />
    <circle cx="50" cy="70" r="5" fill="white" />
  </svg>
);

export const PremiumChevronDown = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M30 40L50 60L70 40" stroke="currentColor" strokeWidth="12" strokeLinecap="round" strokeJoin="round" />
  </svg>
);

export const PremiumRotateCcw = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 50C20 33.4315 33.4315 20 50 20C66.5685 20 80 33.4315 80 50C80 66.5685 66.5685 80 50 80C40 80 32 75 25 68" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <path d="M15 68L25 68V58" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeJoin="round" />
    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" opacity="0.1" />
  </svg>
);

export const PremiumPause = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="30" y="25" width="12" height="50" rx="4" fill="currentColor" />
    <rect x="58" y="25" width="12" height="50" rx="4" fill="currentColor" />
    <rect x="33" y="28" width="6" height="44" rx="2" fill="white" opacity="0.1" />
    <rect x="61" y="28" width="6" height="44" rx="2" fill="white" opacity="0.1" />
  </svg>
);

export const PremiumMinus = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect x="25" y="45" width="50" height="10" rx="5" fill="currentColor" />
    <rect x="25" y="47" width="50" height="3" rx="1" fill="white" opacity="0.1" />
  </svg>
);

export const PremiumFlame = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 10C50 10 75 35 75 60C75 73.8071 63.8071 85 50 85C36.1929 85 25 73.8071 25 60C25 35 50 10 50 10Z" fill="url(#flameGrad1)" />
    <path d="M50 30C50 30 65 45 65 60C65 68.2843 58.2843 75 50 75C41.7157 75 35 68.2843 35 60C35 45 50 30 50 30Z" fill="url(#flameGrad2)" />
    <path d="M50 50C50 50 58 58 58 65C58 69.4183 54.4183 73 50 73C45.5817 73 42 69.4183 42 65C42 58 50 50 50 50Z" fill="#fff176" />
    <defs>
      <linearGradient id="flameGrad1" x1="50" y1="10" x2="50" y2="85">
        <stop offset="0" stopColor="#ff7043" />
        <stop offset="1" stopColor="#d84315" />
      </linearGradient>
      <linearGradient id="flameGrad2" x1="50" y1="30" x2="50" y2="75">
        <stop offset="0" stopColor="#ffb74d" />
        <stop offset="1" stopColor="#ef6c00" />
      </linearGradient>
    </defs>
  </svg>
);

export const PremiumDroplet = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15C50 15 80 45 80 65C80 81.5685 66.5685 95 50 95C33.4315 95 20 81.5685 20 65C20 45 50 15 50 15Z" fill="url(#dropGrad)" />
    <path d="M40 55C35 60 35 65 35 65" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
    <circle cx="48" cy="40" r="5" fill="white" opacity="0.3" />
    <defs>
      <linearGradient id="dropGrad" x1="50" y1="15" x2="50" y2="95">
        <stop offset="0" stopColor="#4fc3f7" />
        <stop offset="1" stopColor="#0288d1" />
      </linearGradient>
    </defs>
  </svg>
);

export const PremiumEgg = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M50 15C35 15 20 35 20 60C20 76.5685 33.4315 90 50 90C66.5685 90 80 76.5685 80 60C80 35 65 15 50 15Z" fill="url(#eggGrad)" />
    <path d="M50 15C35 15 20 35 20 60C20 76.5685 33.4315 90 50 90C66.5685 90 80 76.5685 80 60" stroke="#D1D1D1" strokeWidth="1" />
    <ellipse cx="40" cy="40" rx="8" ry="12" fill="white" opacity="0.6" />
    <path d="M35 70C40 80 60 80 65 70" stroke="#FBC02D" strokeWidth="4" strokeLinecap="round" opacity="0.1" />
    <defs>
      <radialGradient id="eggGrad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="100%" stopColor="#F5F5F5" />
      </radialGradient>
    </defs>
  </svg>
);

export const PremiumBeef = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 50C20 30 40 20 65 20C85 20 90 40 85 60C75 80 45 85 25 75C15 65 20 50 20 50Z" fill="url(#meatGrad)" />
    <path d="M30 45L45 35M35 60L55 45M50 75L75 55" stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.3" />
    <path d="M60 25C70 25 75 30 75 40" stroke="white" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    <circle cx="70" cy="35" r="5" fill="#ef5350" opacity="0.4" />
    <defs>
      <linearGradient id="meatGrad" x1="20" y1="20" x2="85" y2="85">
        <stop offset="0" stopColor="#c62828" />
        <stop offset="1" stopColor="#8e0000" />
      </linearGradient>
    </defs>
  </svg>
);
