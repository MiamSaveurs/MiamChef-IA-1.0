
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
