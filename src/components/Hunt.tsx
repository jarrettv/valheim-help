
import * as supabase from '@supabase/supabase-js';
import { type TrophyHunt } from '../domain';
import { useState, useEffect } from 'react';


export default async function Hunt() {
  const sb = supabase.createClient(
    "https://kkvszipvbsxezcdrgsut.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrdnN6aXB2YnN4ZXpjZHJnc3V0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjM2OTk4MDcsImV4cCI6MjAzOTI3NTgwN30.UlRIl7wtwzNr8jW6pjehojKhPjSDE0imkw_IAHgPdIQ",
  );

  const [hunts, setHunts] = useState<TrophyHunt[]>([]);
  const [error, setError] = useState<supabase.PostgrestError | null>(null);

  useEffect(() => {
    const fetchHunts = async () => {
      let { data, error } = await sb
        .from('trophy_hunts')
        .select("*")
        // Filters
        .eq('hunt', '2024-08-16')
        .order('user_id', { ascending: true });

      setHunts(data!);
      setError(error);
    };
    fetchHunts();
  },[]);
  

  if (error) return <div>Failed to fetch data</div>;

  
  return (
    <div>
      {hunts.map((hunt: any) => (
        <li key={hunt.user_id}>
          <strong>{hunt.hunt}</strong>
          <p>{JSON.stringify(hunt.trophies)}</p>
        </li>
      ))}
    </div>
  );
}