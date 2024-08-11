import { Link } from '@tanstack/react-router'
import './HomePage.css'

export default function HomePage() {
  return (
    <main className="home-page">
      <header>
        <div>
          <Link to="/" className="[&.active]:font-bold">
            <img src="valheim-logo.webp" alt="Valheim" />
          </Link>
          <h1>Help</h1>
        </div>
      </header>
      <article>
        <nav>
          <Link to="/trophy-calc" className="[&.active]:font-bold">
            Trophy Hunt Calculator
          </Link>
          <Link to="/gear" className="[&.active]:font-bold">
            Gear Lookup for Weapons and Armor Info
          </Link>
          <Link to="/food" className="[&.active]:font-bold">
            Food Lookup for Recipes and Info
          </Link>
        </nav>
      </article>
    </main>
  );
};