import { Link } from '@tanstack/react-router'

export default function FoodInfo() {
  return (
    <main>
      <div className="header">
        <div>
          <Link to="/" className="[&.active]:font-bold">
            <img src="valheim-logo.webp" alt="Valheim" />
          </Link>
          <h1>Food Lookup</h1>
        </div>
      </div>
      <div className="content">
        <p>Coming soon...</p>
      </div>
    </main>
  )
}