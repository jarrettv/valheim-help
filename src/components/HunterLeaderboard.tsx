import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $hunts, $huntId, $hunt, $huntPlayers } from '../stores/hunts';
import type { Hunt, HuntItem, HuntPlayer } from '../domain';
import './HunterLeaderboard.css';
import { PhInfoDuotone } from '../icons/PhInfoDuotone';
import { PepiconsPrintGrid } from '../icons/PepiconsPrintGrid';
import { IconParkTwotoneTrophy } from '../icons/IconPartkTwotoneTrophy';
import { getCollection } from 'astro:content';
import TrophyNode from './TrophyNode';
import PenaltyNode from './PenaltyNode';
import { LineMdYoutubeTwotone } from '../icons/LineMdYoutubeTowtone';
import { GameIconsStrong } from '../icons/GameIconsStrong';
import { PhTwitchLogoDuotone } from '../icons/PhTwitchLogoDuotone';
import { IcTwotoneLocalPlay } from '../icons/IcTowtoneLocalPlay';
import RegisterCompetitor from './RegisterCompetitor';
import TimeUntil from './TimeUntil';
import Spinner from './Spinner';

const biomes = ['Meadows', 'Black Forest', 'Ocean', 'Swamp', 'Mountain', 'Plains', 'Mistlands', 'Ashlands']
const trophies = (await getCollection("trophy"))
  .map((trophy) => trophy.data)
  .sort((a, b) => a.score - b.score)
  .sort((a, b) => biomes.indexOf(a.biome) - biomes.indexOf(b.biome))


const deathsrc = trophies.find(x => x.id === 'death1')!.image.src;
const relogsrc = trophies.find(x => x.id === 'relog1')!.image.src;

export default function HunterLeaderboard() {
  const { data: huntsData, loading: huntsLoading } = useStore($hunts);
  const selectedHunt = useStore($huntId);
  const huntData = useStore($hunt);

  useEffect(() => {
    if (huntsData && huntsData.length > 0) {
      var currentHunt = huntsData.find((h) => h.status === 20) ?? huntsData[0];
      $huntId.set(currentHunt.id);
    }
  }, [huntsData]);
  
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (huntData.data?.status === 20) $huntPlayers.invalidate();
    }, 20000); // Invalidate and refresh every 20 seconds
    return () => clearInterval(intervalId); // Cleanup interval on component unmount
  }, [huntData]);

  if (huntsLoading || !huntsData) {
    return <div>Loading...</div>;
  }
  

  function handleSelectHunt(hunt: HuntItem): void {
    $huntId.set(hunt.id);
  }

  return(
  <div className="hunter-leaderboard">
    <div className="hunts">
        {huntsData.sort((a, b) => new Date(b.start_at).getTime() - new Date(a.start_at).getTime()).map((hunt) => (
          <div className={hunt.id === selectedHunt ? 'tab active' : 'tab'} key={hunt.id} onClick={() => handleSelectHunt(hunt)}>{hunt.name}</div>
        ))}
    </div>
    <div>
      {huntData.data ? <HuntDetails huntData={huntData.data!} /> : <div>Loading...</div>}
    </div>
  </div>);

  };

function HuntDetailsInfo({ huntData } : { huntData: Hunt }) {
  return (
    <p>
      {huntData.desc.split('\n').map((item, idx) => {
        return (
          <React.Fragment key={idx}>
            {item}
            <br />
          </React.Fragment>
        );
      })}
    </p>);
}

function HuntDetailsScoring({ huntData } : { huntData: Hunt }) {
  return (<>
    <div className="scoring" style={{backgroundColor:'#0003'}}>
      <div className="item">
        <img src={deathsrc} alt="Death" />
        <div className="score">{huntData.scoring['Death']}</div>
      </div>
      <div className="item">
        <img src={relogsrc} alt="Relog" />
        <div className="score">{huntData.scoring['Relog']}</div>
      </div>
    </div>
    <div className="scoring">
      {trophies.filter(x => x.biome !== 'Penalty').sort((a, b) => a.order - b.order).map((trophy) => (
        <div className="item" key={trophy.id}>
          <img src={trophy.image.src} alt={trophy.name} />
          <div className="score">{huntData.scoring[trophy.code]}</div>
        </div>))}
    </div></>);
}

function HuntDetailsWatch({ huntPlayers } : { huntPlayers: HuntPlayer[] }) {
  if (!huntPlayers) {
    return <div>Loading...</div>;
  }
  return (
  <table className="leaderboard">
    <tbody>
    {huntPlayers.map((hunt) => (
        <tr key={(hunt.hunt_id, hunt.player_id)}>
          <td width="16%" className="hunter">{hunt.name}</td>
          <td style={{padding:'0 1rem', textAlign:'right'}}>
            {hunt.stream && hunt.stream.includes('twitch') && <PhTwitchLogoDuotone fontSize="1.8rem" color="#6141A5" />}  
            {hunt.stream && hunt.stream.includes('youtube') && <LineMdYoutubeTwotone fontSize="1.8rem" color="red" />} 
          </td>
          <td className="watch">
            {hunt.stream && <a href={hunt.stream} target="_blank" rel="noreferrer">{hunt.stream}</a>}
            {!hunt.stream && <span>Not available yet</span>}
          </td>
        </tr>
      ))}
    </tbody>
  </table>);
}

function HuntDetailsCompetitors({ huntPlayers } : { huntPlayers: HuntPlayer[] }) {
  
  if (!huntPlayers) {
    return <div>Loading...</div>;
  }
  return (
    <>
  <table className="leaderboard">
    <tbody>
    {huntPlayers.map((hunt) => (
        <tr key={(hunt.hunt_id, hunt.player_id)}>
          <td width="16%" className="hunter">{hunt.name}</td>
          <td>Personal best: N/A</td>
          <td style={{padding:'0 1rem', textAlign:'right'}}>
            {hunt.stream && hunt.stream.includes('twitch') && <PhTwitchLogoDuotone fontSize="1.8rem" color="#6141A5" />}  
            {hunt.stream && hunt.stream.includes('youtube') && <LineMdYoutubeTwotone fontSize="1.8rem" color="red" />} 
          </td>
          <td className="watch">
            {hunt.stream && <a href={hunt.stream} target="_blank" rel="noreferrer">{hunt.stream}</a>}
            {!hunt.stream && <span>Stream not available yet</span>}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
  <RegisterCompetitor />
</>);
}

function HuntDetailsResults({ huntData, huntPlayers } : { huntData: Hunt, huntPlayers: HuntPlayer[] }) {

  if (!huntPlayers) {
    return <div>Loading...</div>;
  }

  return (
    <>
    { huntData.status === 20 && <div className="pulse">Tournament is LIVE so results will refresh periodically</div> }


  <table className={huntData.status === 20 ? 'leaderboard live' : 'leaderboard'}>
    <tbody>
    {huntPlayers.sort((a, b) => b.score - a.score).map((hunt) => (
        <tr key={(hunt.hunt_id, hunt.player_id)}>
          <td width="16%" className="hunter">{hunt.name}</td>
          <td width="38px" className="score">{hunt.score}</td>
          <td className="items">
            {trophies.filter(x => hunt.trophies.includes(x.code)).map((trophy) => (
              <TrophyNode key={trophy.id} imgsrc={trophy.image.src} score={huntData.scoring[trophy.code]} />))}
            {hunt.deaths > 0 && <PenaltyNode key="death" imgsrc={deathsrc} score={(hunt.deaths * huntData.scoring['Death'])} />}
            {hunt.relogs > 0 && <PenaltyNode key="relog" imgsrc={relogsrc} score={(hunt.relogs * huntData.scoring['Relog'])} />}
          </td>
        </tr>
      ))}
    </tbody>
  </table></>);
}

function HuntDetails({ huntData } : { huntData: Hunt }) {
  const huntPlayers = useStore($huntPlayers);
  const defaultTab = huntData.status === 20 ? 'results' : 'info';
  const [selectedTab, setSelectedTab] = useState<string>(defaultTab);

  function handleTabChange(tab: string): void {
    setSelectedTab(tab);
  }

  return (
    <div className="hunt-details">
      <div className="hunt-head">
        <div>
          <h1>{huntData.name}</h1>
          <div style={{opacity:0.8,marginTop:'-0.25rem'}}>{new Date(huntData.start_at).toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })} {new Date(huntData.start_at).toLocaleTimeString().replace(':00:00 ', '').toLowerCase()}-{new Date(huntData.end_at).toLocaleTimeString().replace(':00:00 ', '').toLowerCase()}</div>
          <div style={{marginTop:'-0.15rem'}} className="hunt-status">
            {huntData.status > 20 && <> Tournament is over</>}
            {huntData.status === 20 && <> Tournament is LIVE for another <TimeUntil targetTime={new Date(huntData.end_at)}/></>}
            {huntData.status < 20 && <> Tournament is starting in <TimeUntil targetTime={new Date(huntData.start_at)}/> </>}
          </div>
        </div>
        <div style={{textAlign:'center'}}>
          <div style={{opacity:0.6}}>Seed</div>
          <div className="hunt-seed">{huntData.seed}</div>
        </div>
      </div>
      <nav style={{maxWidth:'500px'}}>
        <div
          className={selectedTab === 'info' ? 'tab active' : 'tab'}
          onClick={() => handleTabChange('info')}
        >
          <PhInfoDuotone />
          Info
        </div>
        <div
          className={selectedTab === 'scoring' ? 'tab active' : 'tab'}
          onClick={() => handleTabChange('scoring')}
        >
          <PepiconsPrintGrid />
          Scoring
        </div>
        {huntData.status < 20 && (
        <div
          className={selectedTab === 'competitors' ? 'tab active' : 'tab'}
          onClick={() => handleTabChange('competitors')}
        >
          <GameIconsStrong />
          Competitors
        </div>)}
        {huntData.status >= 20 && (
        <div
          className={selectedTab === 'watch' ? 'tab active' : 'tab'}
          onClick={() => handleTabChange('watch')}
        >
          <IcTwotoneLocalPlay />
          Watch
        </div>)}
        {huntData.status >= 20 && (
        <div
          className={selectedTab === 'results' ? 'tab active' : 'tab'}
          onClick={() => handleTabChange('results')}
        >
          <IconParkTwotoneTrophy />
          Results
        </div>)}
      </nav>
      {selectedTab === 'info' && (<HuntDetailsInfo huntData={huntData} />) }
      {selectedTab === 'scoring' && (<HuntDetailsScoring huntData={huntData} />) }
      {selectedTab === 'competitors' && (<HuntDetailsCompetitors huntPlayers={huntPlayers.data!} />) }
      {selectedTab === 'watch' && (<HuntDetailsWatch huntPlayers={huntPlayers.data!} />) }
      {selectedTab === 'results' && (<HuntDetailsResults huntData={huntData} huntPlayers={huntPlayers.data!} />) }
    </div>
  );
};

