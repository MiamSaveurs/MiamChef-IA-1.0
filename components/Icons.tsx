
import React from 'react';

export const WickerBasket = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Anses du panier */}
    <path 
      d="M30 45C30 30 38 20 50 20C62 20 70 30 70 45" 
      stroke="#C08E5E" 
      strokeWidth="6" 
      strokeLinecap="round"
    />
    <path 
      d="M35 45C35 35 42 28 50 28C58 28 65 35 65 45" 
      stroke="#A6784D" 
      strokeWidth="4" 
      strokeLinecap="round"
    />
    
    {/* Corps du panier */}
    <path 
      d="M20 45C20 45 22 80 30 85C38 90 62 90 70 85C78 80 80 45 80 45H20Z" 
      fill="#D9A066" 
    />
    
    {/* Tressage horizontal */}
    <path d="M22 55H78" stroke="#A6784D" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M25 65H75" stroke="#A6784D" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    <path d="M28 75H72" stroke="#A6784D" strokeWidth="2" strokeLinecap="round" opacity="0.6"/>
    
    {/* Tressage vertical */}
    <path d="M35 45V87" stroke="#A6784D" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    <path d="M50 45V89" stroke="#A6784D" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    <path d="M65 45V87" stroke="#A6784D" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
    
    {/* Bordure haute du panier */}
    <rect x="18" y="42" width="64" height="8" rx="4" fill="#C08E5E" />
    <rect x="20" y="44" width="60" height="4" rx="2" fill="#E8C39E" opacity="0.3" />
  </svg>
);

export const GourmetBook = ({ size = 24, className = "" }: { size?: number, className?: string }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Tranche du livre (épaisseur) */}
    <path d="M25 20V80C25 82.7614 27.2386 85 30 85H75C77.7614 85 80 82.7614 80 80V20C80 17.2386 77.7614 15 75 15H30C27.2386 15 25 17.2386 25 20Z" fill="#5D4037" />
    <path d="M28 15V85" stroke="#3E2723" strokeWidth="2" />
    
    {/* Couverture du livre */}
    <rect x="30" y="15" width="50" height="70" rx="3" fill="#8D6E63" />
    
    {/* Texture Cuir / Relief */}
    <rect x="32" y="17" width="46" height="66" rx="2" stroke="#A1887F" strokeWidth="0.5" opacity="0.3" />
    
    {/* Dorure / Titre symbolique */}
    <rect x="40" y="30" width="30" height="2" rx="1" fill="#FFD54F" opacity="0.6" />
    <rect x="40" y="35" width="20" height="2" rx="1" fill="#FFD54F" opacity="0.4" />
    
    {/* Emblem Chef Hat sur la couverture */}
    <path 
      d="M55 55C55 52 52 50 50 50C48 50 45 52 45 55V65H55V55Z" 
      fill="#FFD54F" 
      opacity="0.8"
    />
    <path 
      d="M44 58C44 55 46 53 48 53C49 53 50 54 50 54C50 54 51 53 52 53C54 53 56 55 56 58" 
      stroke="#FFD54F" 
      strokeWidth="2" 
      strokeLinecap="round"
      opacity="0.8"
    />
    
    {/* Page blanche qui dépasse un peu en bas pour le relief */}
    <path d="M30 82H78" stroke="#EFEBE9" strokeWidth="1" opacity="0.5" />
  </svg>
);
