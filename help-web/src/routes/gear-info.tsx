import { createFileRoute } from '@tanstack/react-router'
import GearInfo from '../pages/GearInfo'

export const Route = createFileRoute('/gear-info')({
  component: () => <GearInfo />,
})