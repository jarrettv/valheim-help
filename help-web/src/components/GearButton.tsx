import './GearButton.css';
import { Gear } from '../api/GearApi';

interface GearButtonProps {
  gear: Gear;
}

export default function GearButton(props: GearButtonProps) {
  return (
    <div
      className={`gear`}
    >
      <img src={props.gear.image} alt={props.gear.name} />
      <div className="info">
        <div className="name">{props.gear.name}</div>
      </div>
    </div>
  );
};