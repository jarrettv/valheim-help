import { Link } from '@tanstack/react-router'
import { useState, useEffect } from "react";
import { useQuery } from '@tanstack/react-query';
import { Trophy, fetchTrophies } from "../api/TrophyApi";
import TrophyButton from "../components/TrophyButton";
import './TrophyCalc.css';

export default function TrophyCalc() {
  const [selectedTrophies, setSelectedTrophies] = useState<Trophy[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  const query = useQuery({ queryKey: ['trophies'], queryFn: fetchTrophies });

  useEffect(() => {
    if (selectedTrophies.length > 0) {
      const score = selectedTrophies.reduce((acc, trophy) => acc + trophy.score, 0);
      setTotalScore(score);
    }
  }, [selectedTrophies]);

  const handleTrophyClick = (trophy: Trophy) => {
    if (selectedTrophies.includes(trophy)) {
      setSelectedTrophies(selectedTrophies.filter(t => t !== trophy));
    } else {
      setSelectedTrophies([...selectedTrophies, trophy]);
    }
  };

  if (query.isPending) return 'Loading...';
  if (query.error) return 'An error has occurred: ' + query.error.message;

  const groups = [...new Set(query.data!.map(trophy => trophy.group))];

  return (
    <main className="trophy-calc">
      <header>
        <div>
          <Link to="/" className="[&.active]:font-bold">
            <img src="valheim-logo.webp" alt="Valheim" />
          </Link>
          <h1>Trophy Hunt Calculator</h1>
        </div>
        <div className="score"><div className="score-label">Total Score</div><div className="score-value">{totalScore}</div></div>
      </header>
      <article className="content">
        {groups.map(group => (
          <section key={group}>
            {query.data!
              .filter(trophy => trophy.group === group)
              .map(trophy => (
                <TrophyButton
                  key={trophy.name}
                  trophy={trophy}
                  onClick={handleTrophyClick}
                  isSelected={selectedTrophies.includes(trophy)}
                />
              ))}
          </section>
        ))}
      </article>
    </main>
  )
}