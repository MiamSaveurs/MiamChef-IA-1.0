import React from 'react';

const NUTRI_SCORE_URLS = {
  'A': 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Nutri-score-A.svg/800px-Nutri-score-A.svg.png',
  'B': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Nutri-score-B.svg/800px-Nutri-score-B.svg.png',
  'C': 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Nutri-score-C.svg/800px-Nutri-score-C.svg.png',
  'D': 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Nutri-score-D.svg/800px-Nutri-score-D.svg.png',
  'E': 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nutri-score-E.svg/800px-Nutri-score-E.svg.png'
};

export const NutriScoreLogo = ({ score, className = "h-8" }: { score: string, className?: string }) => {
  const url = NUTRI_SCORE_URLS[score.toUpperCase() as keyof typeof NUTRI_SCORE_URLS];
  
  if (!url) return <span className="font-bold text-white">{score}</span>;

  return (
    <img 
      src={url} 
      alt={`Nutri-Score ${score}`} 
      className={`object-contain ${className}`}
      referrerPolicy="no-referrer"
    />
  );
};
