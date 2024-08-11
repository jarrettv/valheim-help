import { createFileRoute } from '@tanstack/react-router'
import FoodInfo from '../pages/FoodInfo'

export const Route = createFileRoute('/food/')({
  component: () => <FoodInfo />,
})