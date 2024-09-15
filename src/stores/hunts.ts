// stores/huntsStore.ts
import { atom } from 'nanostores';
import type { Hunt, HuntItem, HuntPlayer } from '../domain';
import { createFetcherStore } from './fetcher';

export const $hunts = createFetcherStore<HuntItem[]>('/api/hunts/list');
export const $huntId = atom<number>(0);
export const $hunt = createFetcherStore<Hunt>(['/api/hunts/', $huntId]);
export const $huntPlayers = createFetcherStore<HuntPlayer[]>(['/api/hunts/', $huntId, '/players']);

// export const fetchHuntsLeaderboardQuery = nanoquery({
//   fetcher: async () => {
//     const response = await fetch('/api/hunts/leaderboard');
//     const data = await response.json() as HuntLeaderboard;
//     $hunts.set(data.hunts);
//     $huntId.set(data.currentHunt?.hunt.id ?? 0);
//     return data;
//   },
// });

// export const fetchHuntRecordQuery = nanoquery({
//   fetcher: async () => {
//     var id = $huntId.get();
//     if (id > 0) {
//       const response = await fetch(`/api/hunts/${id}`);
//       const data = await response.json() as HuntRecord;
//       $hunt.set(data.hunt);
//       $huntPlayers.set(data.players);
//       return data;
//     }
//     return null;
//   },
// });

// export const fetchHuntPlayersQuery = nanoquery({
//   fetcher: async () => {
//     var id = $huntId.get();
//     if (id > 0) {
//       const response = await fetch(`/api/hunts/${id}/players`);
//       const data = await response.json() as HuntPlayer[];
//       $huntPlayers.set(data);
//       return data;
//     }
//     return null;
//   },
// });