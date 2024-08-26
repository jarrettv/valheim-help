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