import { createFileRoute } from '@tanstack/react-router'
import GearIndex from '../pages/GearIndex'

export const Route = createFileRoute('/gear/')({
  component: () => <GearIndex />,
})