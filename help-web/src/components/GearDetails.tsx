
import { useState } from 'react';
import { Gear } from '../api/GearApi';
import './GearDetails.css';

interface GearDetailsProps {
  gear: Gear;
  onClose: (gear: Gear) => void;
}

export default function GearButton(props: GearDetailsProps) {
  // add state for current selected level
  var [currentLevel, setCurrentLevel] = useState(1);
  return (
    <div className="gear-details">
      <button onClick={() => props.onClose(props.gear)}>X</button>
      <h2>{props.gear.name}</h2>
      <img src={props.gear.iconUrl} alt={props.gear.name} style={{marginTop:'-0.8rem'}} />
      <div>{props.gear.description}</div>
      <div>Type <strong>{props.gear.type}</strong></div>
      <div>Source <strong>{props.gear.source}</strong></div>
      <div>Wielding <strong>{props.gear.wielding}</strong></div>
      <div>Weight <strong>{props.gear.weight}</strong></div>
      { props.gear.passive && (
          <>
            {Object.entries(props.gear.passive).map(([key, value]) => (
              <div key={key}>{key} <strong>{value}</strong></div>
            ))}
          </>
      )}

      <div className="levels">
        <div className="level-atts level-labels">
          <div className="level-head">Level</div>
          <div>Durability</div>
          <div>Craft/Repair</div>
          { props.gear.levels[0].primaryAttack && (
            <>
            {Object.entries(props.gear.levels[0].primaryAttack).map(([key, _]) => (
                <div key={key}>{key}</div>
            ))}</>
          )}
          { props.gear.levels[0].secondaryAttack && (
            <>
            {Object.entries(props.gear.levels[0].secondaryAttack).map(([key, _]) => (
                <div key={key}>{key}<small>(sec)</small></div>
            ))}</>
          )}
          { props.gear.levels[0].blocking && (
            <>
            {Object.entries(props.gear.levels[0].blocking).map(([key, _]) => (
                <div key={key}>{key}</div>
            ))}</>
          )}
          <div>Materials</div>

        </div>
      
      { props.gear.levels.map(level => (
          <div key={level.level} className={`level-attr ${currentLevel == level.level ? 'selected' : ''}`} onClick={() => setCurrentLevel(level.level)}>
            <div className="level-head">{level.level}</div>
            <div>{level.durability}</div>
            <div>{level.craftingLevel}/{level.repairLevel}</div>
            {Object.entries(level.primaryAttack).map(([key, value]) => (
              <div key={key}>{value}</div>
            ))}
            {Object.entries(level.secondaryAttack).map(([key, value]) => (
              <div key={key}>{value}</div>
            ))}
            {Object.entries(level.blocking).map(([key, value]) => (
              <div key={key}>{value}</div>
            ))}
            <div>
              {Object.entries(level.materials).map(([key, value]) => (
                <div key={key}>➡️{value}x</div>
              ))}
            </div>
          </div>
      ))}
      </div>
            
    </div>
  )
}