import React from 'react';
import './TrophyOption.css';

interface TrophyOptionProps {
  name: string;
  imgSrc: string;
  score: number;
  isSelected: boolean;
  onSelect: () => void;
}

export default function TrophyOption ({name, imgSrc, score, isSelected, onSelect}: TrophyOptionProps) {
  return (
    <div className={`trophy ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
      <img src={imgSrc} alt={name} />
      <div className="score">{score}</div>
    </div>
  );
}

// <img key={trophy.name} src={trophy.image.src} alt={trophy.name} style={{width:'12%', opacity: (hunt.trophies.includes(trophy.name) ? '1' : '0.8')}} />