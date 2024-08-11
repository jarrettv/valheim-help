import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query';
import { fetchGear } from "../api/GearApi";
import GearButton from "../components/GearButton";
import './GearIndex.css';

export default function GearIndex() {

  const query = useQuery({ queryKey: ['gear'], queryFn: fetchGear });

  if (query.isPending) return 'Loading...';
  if (query.error) return 'An error has occurred: ' + query.error.message;

  const groups = ["Spear", "Sword", "Club", "Knife", "Axe", "Polearm", "Fists", "Bow", "Crossbow", "Shield", "Blood magic", "Elemental magic", "Arrow", "Bolt", "Missle"]

  return (
    <main className="gear-index">
      <header>
        <div>
          <Link to="/" className="[&.active]:font-bold">
            <img src="valheim-logo.webp" alt="Valheim" />
          </Link>
          <h1>Gear</h1>
        </div>
      </header>
      <article>
        <section className="gear-all">
          {groups.map(group => (
            <div key={group} className="gear-group">
              {query.data!
                .filter(gear => gear.type === group)
                .sort((a, b) => a.power - b.power)
                .map(gear => (
                  <Link to={`/gear/${gear.id}`} key={gear.id} params={{gearId:gear.id}}>
                    <GearButton gear={gear} />
                  </Link>
                ))}
            </div>
          ))}
        </section>
      </article>
    </main>
  )
}