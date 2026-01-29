
import React from 'react';

// Icons updated to match the minimalist premium line-art style.
// Redesigned PremiumChefHat to be a structured, tall professional toque.

export const WickerBasket = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M30 45C30 30 38 20 50 20C62 20 70 30 70 45" stroke="#C08E5E" strokeWidth="6" strokeLinecap="round"/>
    <path d="M35 45C35 35 42 28 50 28C58 28 65 35 65 45" stroke="#A6784D" strokeWidth="4" strokeLinecap="round"/>
    <path d="M20 45C20 45 22 80 30 85C38 90 62 90 70 85C78 80 80 45 80 45H20Z" fill="#D9A066" />
    <path d="M22 55H78" stroke="#A6784D" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M25 65H75" stroke="#A6784D" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M28 75H72" stroke="#A6784D" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <rect x="18" y="42" width="64" height="8" rx="4" fill="#C08E5E" />
  </svg>
);

export const GourmetBook = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M25 20V80C25 82.7614 27.2386 85 30 85H75C77.7614 85 80 82.7614 80 80V20C80 17.2386 77.7614 15 75 15H30C27.2386 15 25 17.2386 25 20Z" fill="#5D4037" />
    <rect x="30" y="15" width="50" height="70" rx="3" fill="#8D6E63" />
    <rect x="40" y="30" width="30" height="2" rx="1" fill="currentColor" opacity="0.6" />
    <path d="M45 55V65H55V55C55 52 52 50 50 50C48 50 45 52 45 55Z" fill="currentColor" opacity="0.8" />
  </svg>
);

export const PremiumChefHat = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    {/* High structured top with minimalist lines */}
    <path d="M30 65V45C30 35 35 25 50 25C65 25 70 35 70 45V65" stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeJoin="round"/>
    <path d="M40 28V60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
    <path d="M50 25V60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    <path d="M60 28V60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3"/>
    {/* Professional Band */}
    <rect x="25" y="65" width="50" height="12" rx="2" fill="white" stroke="currentColor" strokeWidth="4"/>
  </svg>
);

export const PremiumCrown = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M20 70L30 40L50 60L70 40L80 70H20Z" fill="currentColor" />
    <circle cx="30" cy="40" r="4" fill="currentColor" />
    <circle cx="50" cy="60" r="4" fill="currentColor" />
    <circle cx="70" cy="40" r="4" fill="currentColor" />
    <rect x="20" y="70" width="60" height="8" rx="2" fill="currentColor" opacity="0.8" />
    <circle cx="50" cy="74" r="2" fill="white" />
  </svg>
);

export const PremiumCamera = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="15" y="35" width="70" height="45" rx="8" fill="#333" />
    <rect x="35" y="25" width="30" height="10" rx="2" fill="#222" />
    <circle cx="50" cy="57" r="20" fill="#444" stroke="#555" strokeWidth="2" />
    <circle cx="50" cy="57" r="12" fill="#0a1a2a" />
    <circle cx="45" cy="52" r="3" fill="white" opacity="0.3" />
    <rect x="70" y="42" width="8" height="5" rx="1" fill="currentColor" opacity="0.8" />
  </svg>
);

export const PremiumWine = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M35 20C35 20 35 55 50 55C65 55 65 20 65 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    <path d="M37 35C37 35 37 53 50 53C63 53 63 35 63 35H37Z" fill="#991b1b" />
    <path d="M50 55V85" stroke="currentColor" strokeWidth="2" opacity="0.4" />
    <path d="M35 85H65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
  </svg>
);

export const PremiumCalendar = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="20" y="25" width="60" height="55" rx="6" fill="white" />
    <path d="M20 25H80V40H20V25Z" fill="currentColor" />
    <rect x="30" y="18" width="6" height="12" rx="2" fill="#333" />
    <rect x="64" y="18" width="6" height="12" rx="2" fill="#333" />
  </svg>
);

export const PremiumTimer = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <circle cx="50" cy="55" r="35" fill="#f3f4f6" stroke="#d1d5db" strokeWidth="4" />
    <circle cx="50" cy="55" r="28" stroke="currentColor" strokeWidth="2" strokeDasharray="2 4" />
    <path d="M50 55L50 35" stroke="#333" strokeWidth="4" strokeLinecap="round" />
    <circle cx="50" cy="55" r="4" fill="#333" />
  </svg>
);

export const PremiumPlus = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <circle cx="50" cy="50" r="40" fill="white" opacity="0.1" />
    <rect x="45" y="25" width="10" height="50" rx="5" fill="currentColor" />
    <rect x="25" y="45" width="50" height="10" rx="5" fill="currentColor" />
  </svg>
);

export const PremiumHome = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M20 45L50 20L80 45V80H60V60H40V80H20V45Z" fill="currentColor" />
    <path d="M20 45L50 20L80 45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeJoin="round" />
  </svg>
);

export const PremiumCake = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="20" y="50" width="60" height="30" rx="4" fill="currentColor" />
    <rect x="25" y="40" width="50" height="15" rx="2" fill="#A6784D" />
    <rect x="48" y="25" width="4" height="15" fill="#FFA000" />
    <circle cx="50" cy="20" r="3" fill="#FF5722" />
  </svg>
);

export const PremiumCroissant = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M20 60C20 40 40 20 60 20C75 20 85 30 85 45C85 60 70 80 50 80C30 80 20 70 20 60Z" fill="#D9A066" />
    <path d="M35 35C45 40 55 45 65 45" stroke="#A6784D" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const PremiumSparkles = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M50 15L55 35L75 40L55 45L50 65L45 45L25 40L45 35L50 15Z" fill="currentColor" />
    <path d="M80 60L83 70L93 73L83 76L80 86L77 76L67 73L77 70L80 60Z" fill="currentColor" opacity="0.6" />
  </svg>
);

export const PremiumSearch = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <circle cx="45" cy="45" r="25" stroke="currentColor" strokeWidth="6" />
    <line x1="65" y1="65" x2="85" y2="85" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

export const PremiumUsers = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <circle cx="35" cy="35" r="15" fill="currentColor" />
    <path d="M15 75C15 60 25 55 35 55C45 55 55 60 55 75V80H15V75Z" fill="currentColor" />
  </svg>
);

export const PremiumLeaf = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M50 80C50 80 20 70 20 40C20 20 40 15 50 15C60 15 80 20 80 40C80 70 50 80 50 80Z" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeJoin="round" />
    <path d="M50 80V30" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 50C40 45 35 45 35 45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M50 65C60 60 65 60 65 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const PremiumGlobe = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="4" />
    <ellipse cx="50" cy="50" rx="15" ry="35" stroke="currentColor" strokeWidth="2" />
    <line x1="15" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const PremiumLayers = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M20 40L50 25L80 40L50 55L20 40Z" fill="currentColor" />
    <path d="M20 55L50 70L80 55" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeJoin="round" opacity="0.6" />
    <path d="M20 70L50 85L80 70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeJoin="round" opacity="0.3" />
  </svg>
);

export const PremiumWheat = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M50 85V20" stroke="#8D6E63" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="40" cy="30" rx="8" ry="5" fill="#509f2a" transform="rotate(-30 40 30)" />
    <ellipse cx="60" cy="30" rx="8" ry="5" fill="#509f2a" transform="rotate(30 60 30)" />
  </svg>
);

export const PremiumUtensils = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M30 20V50C30 55 35 60 40 60V85H45V60C50 60 55 55 55 50V20" fill="currentColor" />
    <path d="M65 20C60 20 60 50 60 50V85H75V50C75 50 75 20 65 20Z" fill="currentColor" opacity="0.8" />
  </svg>
);

export const PremiumMedal = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M35 15L50 40L65 15" stroke="#D32F2F" strokeWidth="10" />
    <circle cx="50" cy="60" r="25" fill="currentColor" />
  </svg>
);

export const PremiumEuro = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M70 30C65 20 50 20 40 30C30 40 30 60 40 70C50 80 65 80 70 70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <line x1="25" y1="45" x2="55" y2="45" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <line x1="25" y1="55" x2="55" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

export const PremiumPlay = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M35 25V75L75 50L35 25Z" fill="currentColor" />
  </svg>
);

export const PremiumShoppingCart = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M15 20H25L35 70H85L90 30H30" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeJoin="round" />
    <circle cx="40" cy="85" r="7" fill="currentColor" />
    <circle cx="80" cy="85" r="7" fill="currentColor" />
  </svg>
);

export const PremiumVideo = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="15" y="30" width="50" height="40" rx="5" fill="currentColor" />
    <path d="M65 40L85 30V70L65 60V40Z" fill="currentColor" opacity="0.8" />
  </svg>
);

export const PremiumVolume = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M20 40H35L55 20V80L35 60H20V40Z" fill="currentColor" />
    <path d="M70 35C75 40 75 60 70 65" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const PremiumMic = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="40" y="20" width="20" height="40" rx="10" fill="currentColor" />
    <path d="M30 45V50C30 61 39 70 50 70C61 70 70 61 70 50V45" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
  </svg>
);

export const PremiumMicOff = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="40" y="20" width="20" height="40" rx="10" fill="currentColor" opacity="0.5" />
    <line x1="20" y1="20" x2="80" y2="80" stroke="#EF5350" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const PremiumX = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <line x1="25" y1="25" x2="75" y2="75" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
    <line x1="75" y1="25" x2="25" y2="75" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

export const PremiumMapPin = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M50 15C35 15 25 25 25 40C25 55 50 85 50 85C50 85 75 55 75 40C75 25 65 15 50 15Z" fill="#EF5350" />
    <circle cx="50" cy="40" r="10" fill="white" />
  </svg>
);

export const PremiumStore = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="20" y="50" width="60" height="35" fill="currentColor" opacity="0.3" />
    <path d="M15 50L25 20H75L85 50H15Z" fill="currentColor" />
  </svg>
);

export const PremiumDownload = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M50 20V65M50 65L30 45M50 65L70 45" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeJoin="round" />
    <path d="M20 80H80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const PremiumFingerprint = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M30 70C30 50 40 40 50 40C60 40 70 50 70 70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <path d="M20 70C20 40 35 25 50 25C65 25 80 40 80 70" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const PremiumHeart = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M50 80L45 75C25 60 15 50 15 35C15 23 23 15 35 15C42 15 48 19 50 23C52 19 58 15 65 15C77 15 85 23 85 35C85 50 75 60 55 75L50 80Z" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeJoin="round" />
  </svg>
);

export const PremiumBriefcase = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="20" y="35" width="60" height="45" rx="4" fill="currentColor" />
    <path d="M40 35V25C40 22 42 20 45 20H55C58 20 60 22 60 25V35" stroke="currentColor" strokeWidth="4" fill="transparent" />
  </svg>
);

export const PremiumShield = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M50 15L85 25V55C85 75 70 85 50 90C30 85 15 75 15 55V25L50 15Z" fill="currentColor" />
  </svg>
);

export const PremiumTrash = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M25 30H75V80C75 85 70 90 65 90H35C30 90 25 85 25 80V30Z" fill="currentColor" opacity="0.3" />
    <path d="M20 30H80" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
  </svg>
);

export const PremiumCheck = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <circle cx="50" cy="50" r="40" fill="#509f2a" />
    <path d="M35 50L45 60L65 40" stroke="white" strokeWidth="8" strokeLinecap="round" strokeJoin="round" />
  </svg>
);

export const PremiumAlertCircle = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="6" />
    <line x1="50" y1="30" x2="50" y2="55" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
  </svg>
);

export const PremiumCoffee = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M25 40H65V70C65 80 55 85 45 85C35 85 25 80 25 70V40Z" fill="currentColor" />
  </svg>
);

export const PremiumSoup = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M20 45C20 45 20 85 50 85C80 85 80 45 80 45H20Z" fill="currentColor" />
  </svg>
);

export const PremiumChevronDown = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M25 40L50 65L75 40" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeJoin="round" />
  </svg>
);

export const PremiumPause = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="30" y="25" width="12" height="50" rx="2" fill="currentColor" />
    <rect x="58" y="25" width="12" height="50" rx="2" fill="currentColor" />
  </svg>
);

export const PremiumRotateCcw = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M30 50C30 35 45 25 60 30C75 35 85 50 80 65C75 80 60 90 45 85C35 82 30 75 30 70" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="transparent" />
  </svg>
);

export const PremiumMinus = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <rect x="25" y="45" width="50" height="10" rx="5" fill="currentColor" />
  </svg>
);

export const PremiumFlame = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M50 15C50 15 75 40 75 60C75 75 65 85 50 85C35 85 25 75 25 60C25 40 50 15 50 15Z" fill="currentColor" />
  </svg>
);

export const PremiumDroplet = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M50 15C50 15 25 45 25 65C25 80 35 90 50 90C65 90 75 80 75 65C75 45 50 15 50 15Z" fill="currentColor" />
  </svg>
);

export const PremiumEgg = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <ellipse cx="50" cy="55" rx="30" ry="40" fill="currentColor" opacity="0.3" />
  </svg>
);

export const PremiumBeef = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M20 50C20 30 40 20 70 20C85 20 85 40 85 60C85 80 60 85 40 85C20 85 20 70 20 50Z" fill="currentColor" />
  </svg>
);

export const PremiumPaperPlane = ({ size = 24, className = "", style = {} }: { size?: number, className?: string, style?: React.CSSProperties }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M20 50L85 20L55 85L45 55L20 50Z" fill="currentColor" />
    <path d="M45 55L85 20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
  </svg>
);
