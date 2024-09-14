import React, { useEffect, useState } from 'react';

const HunterLeaderboard: React.FC = () => {
  const [huntData, setHuntData] = useState([]);

  useEffect(() => {
    // Fetch hunt data from "hunts" table
    fetch('/api/hunts/4')
      .then(response => response.json())
      .then(data => setHuntData(data))
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <h1>Hunter Leaderboard</h1>
      { JSON.stringify(huntData) }
    </div>
  );
};

export default HunterLeaderboard;