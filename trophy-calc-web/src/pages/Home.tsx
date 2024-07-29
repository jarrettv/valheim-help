import React, { useState, useEffect } from 'react';
import Trophy from '../components/Trophy';
import trophiesData from '../valheim_trophies_with_scores.json';
import '../App.css';

const Home: React.FC = () => {
  const [selectedTrophies, setSelectedTrophies] = useState<Trophy[]>([]);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const score = selectedTrophies.reduce((acc, trophy) => acc + trophy.score, 0);
    setTotalScore(score);
  }, [selectedTrophies]);

  const handleTrophyClick = (trophy: Trophy) => {
    if (selectedTrophies.includes(trophy)) {
      setSelectedTrophies(selectedTrophies.filter(t => t !== trophy));
    } else {
      setSelectedTrophies([...selectedTrophies, trophy]);
    }
  };

  const biomes = [...new Set(trophiesData.map(trophy => trophy.biome))];

  return (
    <div className="App">
      <div className="header">
        <img src="valheim-logo.webp" alt="Valheim" />
        <h1>Trophy Hunt Calculator</h1>
        <div className="score"><div>Total Score</div><div className="score-value">{totalScore}</div></div>
      </div>
      <div className="content">
        {biomes.map(biome => (
          <div key={biome} className="biome-section">
            <div className="trophies-container">
              {trophiesData
                .filter(trophy => trophy.biome === biome)
                .map(trophy => (
                  <Trophy
                    key={trophy.name}
                    trophy={trophy}
                    onClick={handleTrophyClick}
                    isSelected={selectedTrophies.includes(trophy)}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
