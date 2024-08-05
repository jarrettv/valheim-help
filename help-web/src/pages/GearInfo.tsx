import { Link } from '@tanstack/react-router'
import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { Gear, fetchGear } from "../api/GearApi";
import GearButton from "../components/GearButton";
import './GearInfo.css';
import GearDetails from '../components/GearDetails';

export default function GearInfo() {

  const query = useQuery({ queryKey: ['gear'], queryFn: fetchGear });
  const [selectedGears, setSelectedGears] = useState<Gear[]>([]);


  if (query.isPending) return 'Loading...';
  if (query.error) return 'An error has occurred: ' + query.error.message;

  const groups = ["Spear", "Sword", "Club", "Knife", "Axe", "Polearm", "Fists", "Bow", "Crossbow", "Shield", "Blood magic", "Elemental magic", "Arrow", "Bolt", "Missle"]

  function onGearClick(gear: Gear): void {
    setSelectedGears(prevGears => [...prevGears, gear]);
    if (selectedGears.length >= 2) {
      setSelectedGears(selectedGears.slice(1));
    }
  }

  function onRemoveGear(gear: Gear): void {
    setSelectedGears(selectedGears.filter(g => g !== gear));
  }

  return (
    <main className="gear-info">
      <header>
        <div>
          <Link to="/" className="[&.active]:font-bold">
            <img src="valheim-logo.webp" alt="Valheim" />
          </Link>
          <h1>Gear Info</h1>
        </div>
      </header>
      <article>
          {selectedGears.length < 2 && (
            <section className="gear-all">
              {groups.map(group => (
                <div key={group} className="gear-group">
                  {query.data!
                    .filter(gear => gear.type === group)
                    .sort((a, b) => a.power - b.power)
                    .map(gear => (
                      <GearButton key={gear.id} gear={gear} isSelected={selectedGears.includes(gear)} onClick={onGearClick} />
                    ))}
                </div>
              ))}
            </section>
          )}
          {selectedGears.length > 0 && (
            <GearDetails gear={selectedGears[0]} onClose={onRemoveGear} />
          )}
          {selectedGears.length == 2 && (
            <>
              <section className="gear-diff">
              </section>
              <GearDetails gear={selectedGears[1]} onClose={onRemoveGear} />
            </>
          )}
      </article>
    </main>
  )
}