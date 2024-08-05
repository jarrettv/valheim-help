import { createFileRoute } from '@tanstack/react-router'
import TrophyCalc from '../pages/TrophyCalc'

export const Route = createFileRoute('/trophy-calc')({
  component: () => <TrophyCalc/>
})