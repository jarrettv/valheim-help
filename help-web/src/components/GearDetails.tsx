
import { Gear } from '../api/GearApi';
import './GearDetails.css';

interface GearDetailsProps {
  gear: Gear;
  onClose: (gear: Gear) => void;
}

function roundIfPossible(value: string): string {
  if (value.includes('%')) return value;
  if (value.includes('s')) return value;
  const num = parseFloat(value);

  // Check if the conversion resulted in a valid number
  if (!isNaN(num)) {
    return Math.round(num).toString();
  }
  return value; // Return the original string if it's not a valid number
}

function BubbleLevels({ group, name='', value }: { group: string, name?: string, value: string }) {
  var hasSecondary = value.includes(';');
  var primary = hasSecondary ? value.split(';')[0] : value;
  var secondary = hasSecondary ? value.split(';')[1] : '';
  var bubbles = primary.split('>');
  var groupClass = group.replace(/ /g, '-').toLowerCase();
  if (new Set(bubbles).size === 1) {
    bubbles = [bubbles[0]];
  }
  var bubbles2 = secondary.split('>');
  if (new Set(bubbles2).size === 1) {
    bubbles2 = [bubbles2[0]];
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1, flexFlow: 'row nowrap', height: '1.8rem' }}>
      {group === 'mat' && <img alt={name} src={`mats/${name.replace(/ /g, '_').toLowerCase()}.png`} style={{ width: '1.8rem', height: '1.8rem', marginRight:'0.5rem', marginLeft:'-2rem', verticalAlign:'middle' }} /> }
        {bubbles.map((bubble, index) => (
          <div key={index} className={`bubble ${groupClass} ${bubble === '0' ? 'none': ''}`}>
            {roundIfPossible(bubble)}
          </div>
        ))}
      </div>
      {secondary && <div style={{ flex: 1, flexWrap: 'nowrap', height: '1.8rem' }}>
        {secondary && bubbles2.map((bubble, index) => (
          <div key={index} className={`bubble ${groupClass} sec`}>
            {roundIfPossible(bubble)}
          </div>
        ))}

      </div>}
    </div>
  );
}

export default function GearButton(props: GearDetailsProps) {

  function mapKeyToGroup(key: string): string {
    switch (key) {
      case 'Slash':
      case 'Blunt':
      case 'Pierce':
        return 'attk';
      case 'Frost':
          return 'frost';
      case 'Fire':
          return 'fire';
      case 'Spirit':
          return 'spirit';
      case 'Poison':
          return 'poison';
      default:
        return 'stat';
    }
  }

  return (
    <div className="gear-details">
      <button onClick={() => props.onClose(props.gear)}>X</button>


      <table>
        <thead>
          <tr>
            <td rowSpan={2}><img src={props.gear.image} alt={props.gear.name} style={{ marginTop: '-0.8rem' }} /></td>
            <td><h2 title={props.gear.code}>{props.gear.name}</h2>
              <h5>{props.gear.desc}</h5></td>
          </tr>
        </thead>
        <tbody>
          <tr><td>Type</td><td>{props.gear.type}</td></tr>
          <tr><td>Wielding</td><td>{props.gear.wield}</td></tr>
          <tr><td>Source</td><td>{props.gear.source}</td></tr>
          <tr><td>Weight</td><td>{props.gear.weight}kg</td></tr>
          <tr><td>Durability</td><td><BubbleLevels group="stat" value={props.gear.durab} /></td></tr>
          <tr><td>Craft Level</td><td><BubbleLevels group="stat" value={props.gear.craft} /></td></tr>
          <tr><td>Repair Level</td><td><BubbleLevels group="stat" value={props.gear.repair} /></td></tr>
          <tr><td>Materials</td><td>
            {Object.entries(props.gear.mats).map(([key, value]) => (
              <div key={key}>
                <BubbleLevels group="mat" name={key} value={value} />              
              </div>
            ))}</td></tr>
          {props.gear.passive && Object.entries(props.gear.passive).map(([key, value]) => (
            <tr key={key}><td>{key}</td><td><BubbleLevels group="penalty" value={`${value}%`} /></td></tr>
          ))}
          {props.gear.attack && Object.entries(props.gear.attack).map(([key, value]) => (
            <tr key={key}><td>{key}</td><td><BubbleLevels group={mapKeyToGroup(key)} value={value} /></td></tr>
          ))}
          {props.gear.block && Object.entries(props.gear.block).map(([key, value]) => (
            <tr key={key}><td>{key}</td><td>{<BubbleLevels group='block' value={value} />}</td></tr>
          ))}
        </tbody></table>


    </div>
  )
}