import React from 'react';
import './Trophy.css';

interface TrophyProps {
  trophy: Trophy;
  onClick: (trophy: Trophy) => void;
  isSelected: boolean;
}

interface Trophy {
  biome: string;
  iconUrl: string;
  name: string;
  url: string;
  droppedBy: string;
  droppedByUrl: string;
  dropChance: string;
  uses: string;
  score: number;
}

const Trophy: React.FC<TrophyProps> = ({ trophy, onClick, isSelected }) => {
  return (
    <div
      className={`trophy ${isSelected ? 'selected' : ''}`}
      onClick={() => onClick(trophy)}
    >
      <div className="score">{trophy.score}</div>
      <div className="chance">{trophy.dropChance}</div>
      <img src={trophy.iconUrl} alt={trophy.name} />
      <div className="trophy-info">
        <div style={{margin: '-0.6rem 0 0 0', fontSize:'1.4rem'}}>{trophy.name}</div>
        <div style={{margin: '-0.1rem 0 0 0', opacity:0.8}}>{trophy.biome}</div>
      </div>
    </div>
  );
};

export default Trophy;
