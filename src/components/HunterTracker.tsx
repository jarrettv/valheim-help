import { useEffect, useState } from "react";
import type { TrophyHunt } from "../domain";
import { createClient } from "@supabase/supabase-js";
import { getCollection, getEntry } from "astro:content";
import './HunterTracker.css';

const huntCode = 'hunt_6';
const huntName = 'Trophy Hunt Tournament #6';
const trophies = (await getCollection("trophy"))
  .map((trophy) => trophy.data);

function TrophyNode({trophyId, score}: {trophyId: string, score: number}) {
  const trophy = trophies.find((trophy) => trophy.id === trophyId);
  if (trophy && trophy.image && trophy.image.src) {
    return (
    <div className="trophy-node" style={{backgroundImage:`url(${trophy.image.src})`}}>
      <div>
        {score}
      </div>
    </div>);
  }
  return (<span>{trophyId}</span>);
}

function PenaltyNode({trophyId, score}: {trophyId: string, score: number}) {
  const trophy = trophies.find((trophy) => trophy.id === trophyId);
  if (trophy && trophy.image && trophy.image.src) {
    return (
    <div className="trophy-node penalty" style={{backgroundImage:`url(${trophy.image.src})`}}>
      <div>
        {score}
      </div>
    </div>);
  }
  return (<span>{trophyId}</span>);
}


export default function HunterTracker() {
  const [hunts, setHunts] = useState<TrophyHunt[]>([]);
  const [loading, setLoading] = useState('');

  const sb = createClient(
    "https://kkvszipvbsxezcdrgsut.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdnN6aXB2YnN4ZXpjZHJnc3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2OTk4MDcsImV4cCI6MjAzOTI3NTgwN30.UlRIl7wtwzNr8jW6pjehojKhPjSDE0imkw_IAHgPdIQ",
  );

  
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await sb
      .from('trophy_hunts')
      .select("*")
      .eq('hunt', huntCode)
      .order('score', { ascending: false });
      if (data) {
        setHunts(data);
      }
      setLoading('');
    };
    setLoading('loading');
    fetchData();
    
    const intervalId = setInterval(fetchData, 30000); // Fetch every 30 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [])


  return (
    <>
    <h2>{huntName} Leaderboard</h2>
    
    <table className="leaderboard">
    <tbody>
      {hunts.map((hunt) => (
        <tr key={(hunt.hunt, hunt.hunter)}>
          <td width="16%" className="hunter">{hunt.hunter}</td>
          <td width="38px" className="score">{hunt.score}</td>
          <td className="items">
            {trophies.sort((a, b) => a.order - b.order).filter(x => hunt.trophies.includes(x.id)).map((trophy) => (
              <TrophyNode key={trophy.id} trophyId={trophy.id} score={trophy.score} />))}
            {hunt.deaths > 0 && <PenaltyNode key="death" trophyId="death1" score={-(hunt.deaths * 20)} />}
            {hunt.relogs > 0 && <PenaltyNode key="relog" trophyId="relog1" score={-(hunt.relogs * 10)} />}
          </td>
        </tr>
      ))}
    </tbody>
  </table></>
  );
}
