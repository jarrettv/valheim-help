export type Trophy = {
  group: string;
  biome: string;
  iconUrl: string;
  name: string;
  url: string;
  droppedBy: string;
  droppedByUrl: string;
  dropChance: string;
  uses: string;
  score: number;
}


export const fetchTrophies = async (): Promise<Trophy[]> => {
  const res = await fetch('trophies.json');
  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  return res.json();
};