import React from "react";
import { createClient, type User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import type { TrophyHunt } from "../domain";
import './HunterHunt.css';
import { getCollection } from "astro:content";

const trophies = (await getCollection("trophy"))
  .map((trophy) => trophy.data)
  .filter((trophy) => trophy.group !== 'Ocean/Penalty');
const groups = ['Meadows', 'Black Forest', 'Swamp', 'Mountain', 'Plains', 'Mistlands', 'Ashlands', 'Ocean/Penalty'];

export default function HunterHunt() {

  const [user, setUser] = useState<User | null>(null);
  const [hunt, setHunt] = useState<TrophyHunt | null>(null);

  const sb = createClient(
    "https://kkvszipvbsxezcdrgsut.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdnN6aXB2YnN4ZXpjZHJnc3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2OTk4MDcsImV4cCI6MjAzOTI3NTgwN30.UlRIl7wtwzNr8jW6pjehojKhPjSDE0imkw_IAHgPdIQ",
  );

  useEffect(() => {
    const fetchData = async () => {
      const resp = await sb.auth.getUser();
      setUser(resp.data.user);
      console.log(resp);

      let { data } = await sb
        .from('trophy_hunts')
        .select("*")
        // Filters
        .eq('hunt', '2024-08-16')
        .eq('user_id', resp.data.user!.id);

      console.log(data);
      if (data) {
        setHunt(data[0]);
      }
    };
    fetchData();
  }, [])

  
  const register = async () => {
    if (!user) {
      console.log('User not logged in');
      return;
    }

    const newHunt = { hunt: '2024-08-16', user_id: user.id, trophies: '' }

    const { data, error } = await sb
      .from('trophy_hunts')
      .insert([newHunt]);

    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Registration successful:', data);
      setHunt({ ...newHunt, created_at: new Date(), updated_at: new Date()});
    }
  };

  return (
    <div className="hunter-hunt">
      {!hunt && !user && (
        <div className="warn">
          You need to login with your discord account to register for a hunt.
        </div>
      )}
      {!hunt && user && (
        <div className="join" style={{display:'flex'}}>
          <div>2024-08-16 Hunt</div>
          <button className='discord' style={{ display: 'flex', gap: '1rem' }} onClick={register}>
            <div>Register</div>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 199">
              <path fill="#fff" d="M216.856 16.597A208.5 208.5 0 0 0 164.042 0c-2.275 4.113-4.933 9.645-6.766 14.046q-29.538-4.442-58.533 0c-1.832-4.4-4.55-9.933-6.846-14.046a207.8 207.8 0 0 0-52.855 16.638C5.618 67.147-3.443 116.4 1.087 164.956c22.169 16.555 43.653 26.612 64.775 33.193A161 161 0 0 0 79.735 175.3a136.4 136.4 0 0 1-21.846-10.632a109 109 0 0 0 5.356-4.237c42.122 19.702 87.89 19.702 129.51 0a132 132 0 0 0 5.355 4.237a136 136 0 0 1-21.886 10.653c4.006 8.02 8.638 15.67 13.873 22.848c21.142-6.58 42.646-16.637 64.815-33.213c5.316-56.288-9.08-105.09-38.056-148.36M85.474 135.095c-12.645 0-23.015-11.805-23.015-26.18s10.149-26.2 23.015-26.2s23.236 11.804 23.015 26.2c.02 14.375-10.148 26.18-23.015 26.18m85.051 0c-12.645 0-23.014-11.805-23.014-26.18s10.148-26.2 23.014-26.2c12.867 0 23.236 11.804 23.015 26.2c0 14.375-10.148 26.18-23.015 26.18" />
            </svg>
            <strong>{user.user_metadata?.custom_claims?.global_name}</strong>
          </button>
        </div>
      )}
      {hunt && user && (
        <div className="hunt">
          <div style={{minWidth:'8rem'}}>
            <div>{user.user_metadata?.custom_claims?.global_name}</div>
            <div>Score 0</div>
          </div>
          <div style={{flex:1,display:'flex',flexWrap:'wrap'}}>
            {groups.map((group) => (
              <>
                  {trophies.filter(t => t.group === group).map((trophy) => (
                    <img src={trophy.image.src} alt={trophy.name} style={{width:'12%'}} />
                  ))}
              </>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}