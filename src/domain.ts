export type TrophyHunt = {
  user_id: string
  hunt: string
  hunter: string
  trophies: string[]
  created_at: Date
  updated_at: Date
  deaths: number
  relogs: number
  score: number
  locked: boolean
}

export type Hunt = {
  id: number
  name: string
  desc: string
  start_at: Date
  end_at: Date
  seed: string
  status: number
  scoring: { [key: string]: number }
}

export type HuntRecord = {
  hunt: Hunt
  players: HuntPlayer[]
}

export type HuntItem = {
  id: number
  name: string
  start_at: Date
  end_at: Date
  status: number
  current: boolean
}

export type HuntPlayer = {
  hunt_id: number
  player_id: string
  name: string
  stream: string
  status: number
  score: number
  deaths: number
  relogs: number
  trophies: string[]
}