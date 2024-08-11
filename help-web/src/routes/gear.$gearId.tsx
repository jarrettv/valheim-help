import { createFileRoute } from '@tanstack/react-router'
import GearDetails from '../pages/GearDetails'
import { fetchGear } from '../api/GearApi'

export const Route = createFileRoute('/gear/$gearId')({
  loader: async () => await fetchGear(),
  component: () => <GearDetails />,
})