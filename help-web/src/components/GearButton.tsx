import './GearButton.css';
import { Gear } from '../api/GearApi';

interface GearButtonProps {
  gear: Gear;
  onClick: (gear: Gear) => void;
  isSelected: boolean;
}

export default function GearButton(props: GearButtonProps) {
  return (
    <div
      className={`gear ${props.isSelected ? 'selected' : ''}`}
      onClick={() => props.onClick(props.gear)}
    >
      <img src={props.gear.image} alt={props.gear.name} />
      <div className="info">
        <div className="name">{props.gear.name}</div>
      </div>
    </div>
  );
};