import './TrophyButton.css';
import { Trophy } from '../api/TrophyApi';

interface TrophyButtonProps {
  trophy: Trophy;
  onClick: (trophy: Trophy) => void;
  isSelected: boolean;
}

export default function TrophyButton(props: TrophyButtonProps) {
  return (
    <div
      className={`trophy ${props.isSelected ? 'selected' : ''}`}
      onClick={() => props.onClick(props.trophy)}
    >
      <div className="score">{props.trophy.score}</div>
      <div className="chance">{props.trophy.dropChance}</div>
      <img src={props.trophy.iconUrl} alt={props.trophy.name} />
      <div className="info">
        <div className="name">{props.trophy.name}</div>
        <div className="subname">{props.trophy.biome}</div>
      </div>
    </div>
  );
};