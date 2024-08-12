
import { Link } from '@tanstack/react-router';
import './GearDetails.css';
import { Route } from '../routes/gear.$gearId';
import { Gear } from '../api/GearApi';

function roundIfPossible(value: string): string {
  if (value.includes('%')) return value;
  if (value.includes('s')) return value;
  if (value.includes('x')) return value;
  const num = parseFloat(value);

  // Check if the conversion resulted in a valid number
  if (!isNaN(num)) {
    return Math.round(num).toString();
  }
  return value; // Return the original string if it's not a valid number
}

function BubbleLevels({ group, name = '', value }: { group: string, name?: string, value: string }) {
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
    <div className="bubble-row">
      <div className="bubble-group">
        {group === 'mat' && <img alt={name} src={`/mats/${name.replace(/ /g, '_').toLowerCase()}.png`} />}
        {bubbles.map((bubble, index) => (
          <div key={index} className={`bubble ${groupClass} ${bubble === '0' ? 'none' : ''}`}>
            {roundIfPossible(bubble)}
          </div>
        ))}
      </div>
      {secondary && <div className="bubble-group">
        {secondary && bubbles2.map((bubble, index) => (
          <div key={index} className={`bubble ${groupClass} ${bubble === '0' ? 'none ' : ''}sec`}>
            {roundIfPossible(bubble)}
          </div>
        ))}

      </div>}
    </div>
  );
}


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
    case 'Lightning':
      return 'lightning';
    case 'Stamina':
      return 'stam';
    case 'Eitr':
      return 'eitr';
    default:
      return 'stat';
  }
}

export default function GearDetails() {

  const gear = Route.useLoaderData({select: data => data.find((gear: Gear) => gear.id === Route.useParams().gearId)});

  if (!gear) return "Couldn't find gear";

  return (
    <main className="gear-details">
      <header>
        <div>
          <Link to="/" className="[&.active]:font-bold">
            <img src="/valheim-logo.webp" alt="Valheim" />
          </Link>
          <h1>Gear</h1>
          <Link to="/gear" style={{marginLeft:'2rem', fontSize:'2rem'}}>Back</Link>
        </div>
      </header>
      <article>
        <table>
          <thead>
            <tr>
              <td rowSpan={2}><img src={`/${gear.image}`} alt={gear.name} style={{ margin: '-0.2rem 0 0 0.4rem', width: '80px', height:'80px' }} /></td>
              <td><h2 title={gear.code}>{gear.name}</h2>
                <h5>{gear.desc}</h5></td>
            </tr>
          </thead>
          <tbody>
            <tr><td>Style</td><td>{gear.wield} {gear.type}</td></tr>
            <tr><td>Source / Wt</td><td>{gear.source} / {gear.weight}kg</td></tr>
            <tr><td>Durability</td><td><BubbleLevels group="stat" value={gear.durab} /></td></tr>
            <tr><td>Craft Level</td><td><BubbleLevels group="stat" value={gear.craft} /></td></tr>
            <tr><td>Repair Level</td><td><BubbleLevels group="stat" value={gear.repair} /></td></tr>
            <tr><td>Materials</td><td>
              {Object.entries(gear.mats).map(([key, value]) => (
                <div key={key}>
                  <BubbleLevels group="mat" name={key} value={value} />
                </div>
              ))}</td></tr>
            {gear.passive && Object.entries(gear.passive).map(([key, value]) => (
              <tr key={key}><td>{key}</td><td><BubbleLevels group="penalty" value={`${value}%`} /></td></tr>
            ))}
            {gear.attack && Object.entries(gear.attack).map(([key, value]) => (
              <tr key={key}><td>{key}</td><td><BubbleLevels group={mapKeyToGroup(key)} value={value} /></td></tr>
            ))}
            {gear.block && Object.entries(gear.block).map(([key, value]) => (
              <tr key={key}><td>{key}</td><td>{<BubbleLevels group='block' value={value} />}</td></tr>
            ))}
          </tbody></table>
      </article>
    </main>

  )
}